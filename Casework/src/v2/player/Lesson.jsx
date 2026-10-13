// One case on one page: the situation, the key facts, your call. After you answer, the options
// stay where they are and become the answer key, with the lesson directly underneath, so nothing
// has to be remembered from a previous screen.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPerson } from '../content/cast';
import { gradeDecision, VERDICT } from '../engine/scoring';
import { castVote, MIN_VOTES_TO_SHOW, totalVotes } from '../engine/stats';
import { CHOICE_VISUALS } from '../ui/mocks';
import { ComposeBody, SpotBody, TriageBody } from './HandsOn';
import { shuffled } from './shuffle';

function useKeys(handler, active) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
}

/** Older cases without a written situation fall back to their scene lines. */
function situationText(caseData) {
  if (caseData.situation) return caseData.situation;
  return (caseData.scene || []).map(b => `${getPerson(b.who).name.split(' ')[0]}: "${b.says}"`).join(' ');
}

export default function Lesson({ caseData, kicker, priorAnswer, review = false, onResolved, onNext, nextLabel = 'Next case', onView, header }) {
  const [initialAnswer] = useState(review ? null : priorAnswer || null);
  const [result, setResult] = useState(initialAnswer);
  const [votes, setVotes] = useState(undefined);
  const callRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => { onView?.(caseData.id); }, [caseData.id, onView]);
  useEffect(() => {
    if (initialAnswer) castVote(caseData.id, initialAnswer.voteKey).then(setVotes);
  }, [caseData.id, initialAnswer]);

  const resolve = useCallback((graded, extra = {}) => {
    const answer = { verdict: graded.verdict, meters: graded.meters, voteKey: graded.voteKey, ...extra };
    setResult(answer);
    onResolved?.(answer);
    castVote(caseData.id, graded.voteKey).then(setVotes);
    // Scroll so the question, the marked options and the outcome are on screen together.
    setTimeout(() => {
      callRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nextRef.current?.focus({ preventScroll: true });
    }, 300);
  }, [caseData.id, onResolved]);

  useKeys(useCallback((e) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
  }, [onNext]), Boolean(result));

  return (
    <main className="lesson">
      {header}
      <div className="lesson__head rise">
        <span className="label">{kicker}</span>
        <h1 className="display lesson__title">{caseData.title}</h1>
      </div>

      <section className="lesson__situation rise rise-2" aria-label="The situation">
        <p className="situation">{situationText(caseData)}</p>
        {caseData.evidence?.length > 0 && (
          <div className="evidence" aria-label="Key facts">
            {caseData.evidence.map((e, i) => (
              <div className="note" key={e.label} style={{ '--tilt': `${[-1.2, 0.8, -0.4][i % 3]}deg` }}>
                <b>{e.value}</b>
                <span>{e.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section ref={callRef} className="lesson__call rise rise-3" aria-label="Your call">
        {caseData.kind === 'decision' && (
          <>
            <h2 className="ask">{caseData.ask}</h2>
            <Choices caseData={caseData} result={result} votes={votes} onChoose={resolve} />
          </>
        )}
        {caseData.kind === 'spot' && <SpotBody caseData={caseData} result={result} onResolve={resolve} />}
        {caseData.kind === 'compose' && <ComposeBody caseData={caseData} result={result} onResolve={resolve} />}
        {caseData.kind === 'triage' && <TriageBody caseData={caseData} result={result} onResolve={resolve} />}
      </section>

      {result && (
        <section className="lesson__learn" aria-label="What happened and why">
          <Outcome caseData={caseData} result={result} votes={votes} />
          <StrongCall caseData={caseData} result={result} />
          <div className="principle rise rise-2">
            <span className="label">{result.verdict === 'strong' ? 'The principle' : 'Why the strong call works'}</span>
            <h2 className="display">{caseData.debrief.principle}</h2>
            <p>{caseData.debrief.insight}</p>
          </div>
          <div className="trap rise rise-3">
            <span className="label">Why the tempting answer fails</span>
            <p>{caseData.debrief.trap}</p>
          </div>
          <div className="panel-actions">
            <button type="button" ref={nextRef} className="btn btn-orange" onClick={onNext}>
              {nextLabel} <span className="kbd">Enter</span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function Choices({ caseData, result, votes, onChoose }) {
  const choices = useMemo(() => shuffled(caseData.choices, caseData.id), [caseData]);
  const total = totalVotes(votes);
  const showPct = Boolean(votes) && total >= MIN_VOTES_TO_SHOW;
  const revealed = Boolean(result);

  const choose = useCallback((id) => {
    if (result) return;
    const graded = gradeDecision(caseData, id);
    onChoose(graded, { choiceId: id, outcome: graded.choice.outcome });
  }, [caseData, result, onChoose]);

  useKeys(useCallback((e) => {
    const target = choices[Number(e.key) - 1];
    if (target) choose(target.id);
  }, [choices, choose]), !result);

  return (
    <>
      <div className="choices" role="group" aria-label="Your options">
        {choices.map((c, i) => {
          const picked = result?.choiceId === c.id;
          const pct = showPct ? Math.round(((votes[c.id] || 0) / total) * 100) : null;
          const Visual = c.visual && CHOICE_VISUALS[c.visual];
          const cls = ['choice', revealed && 'is-revealed', picked && 'is-picked', revealed && !picked && c.verdict !== 'strong' && 'is-faded', revealed && `is-${c.verdict}`].filter(Boolean).join(' ');
          return (
            <button type="button" key={c.id} className={cls} disabled={revealed} onClick={() => choose(c.id)}>
              {revealed && <span className="choice__fill" style={{ width: showPct ? `${pct}%` : '0%' }} />}
              {Visual && <span className="choice__visual" aria-hidden="true"><Visual /></span>}
              <span className="choice__key">{i + 1}</span>
              <span className="choice__text">
                {revealed && picked && <span className="choice__you">Your pick</span>}
                {c.text}
              </span>
              {revealed && (
                <span className="choice__meta">
                  <span className={`tag tag--${c.verdict}`}>{VERDICT[c.verdict].label}</span>
                  {showPct && <span className="choice__pct">{pct}% chose this</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!revealed && <p className="hint">Press 1 to {choices.length}, or tap an option</p>}
    </>
  );
}

/** After a weaker pick, show the strong call and what it would have led to, so the lesson is complete. */
function StrongCall({ caseData, result }) {
  if (caseData.kind !== 'decision' || result.verdict === 'strong') return null;
  const strong = caseData.choices.find(c => c.verdict === 'strong');
  if (!strong) return null;
  return (
    <div className="strong-call rise rise-2">
      <span className="tag tag--strong">The strong call</span>
      <p className="strong-call__text">{strong.text}</p>
      <span className="label">What would have happened</span>
      <p className="strong-call__story">{strong.outcome}</p>
    </div>
  );
}

function Outcome({ caseData, result, votes }) {
  const v = VERDICT[result.verdict];
  const total = totalVotes(votes);
  const score = caseData.kind === 'spot' ? `You found ${result.found} of ${caseData.hotspots.length}.`
    : caseData.kind === 'compose' ? `${result.points} of ${caseData.slots.length * 2} points.`
      : caseData.kind === 'triage' ? `${result.points} of ${result.max} points.` : null;

  let crowd = null;
  if (votes === undefined) crowd = null;
  else if (total <= 1) crowd = 'You are the first designer to answer this one.';
  else if (total < MIN_VOTES_TO_SHOW) crowd = `One of the first ${total} designers to answer this.`;
  else if (caseData.kind === 'spot') {
    const avg = Object.entries(votes).reduce((s, [k, c]) => s + Number(k.slice(1)) * c, 0) / total;
    crowd = `Designers find ${avg.toFixed(1)} of ${caseData.hotspots.length} on average. ${total.toLocaleString()} played.`;
  } else if (caseData.kind !== 'decision') {
    crowd = `${Math.round(((votes.strong || 0) / total) * 100)}% of ${total.toLocaleString()} designers got this fully right.`;
  } else crowd = `${total.toLocaleString()} designers answered.`;

  return (
    <div className={`outcome outcome--${result.verdict} rise`}>
      <span className={`tag tag--${result.verdict}`}>{v.label}</span>
      {score && <p className="outcome__score">{score}</p>}
      {result.outcome && (
        <>
          <span className="label">What happened</span>
          <p className="outcome__story">{result.outcome}</p>
        </>
      )}
      {crowd && <p className="outcome__crowd">{crowd}</p>}
    </div>
  );
}
