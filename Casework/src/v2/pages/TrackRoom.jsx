// A track page: what the track is about, then the syllabus. Every chapter lists its cases with the
// principle each one teaches and how you did. Finishing a chapter lands here with a short summary.
import { useEffect, useMemo, useState } from 'react';
import { countVerdicts, getArchetype, METERS, sumMeters, sumRep, VERDICT } from '../engine/scoring';
import { markTrackComplete, resetTrack } from '../engine/store';
import { track as trackEvent } from '../engine/analytics';
import { copyText, linkedInIntent, renderProfileCard, shareOrDownload, siteUrl, verdictStrip, xIntent } from '../ui/share';
import { onLinkClick } from '../ui/router';

const KIND_LABEL = { spot: 'Hands-on', compose: 'Hands-on', triage: 'Hands-on' };

function caseUrl(track, caseId) {
  return `/play/${track.id}/${caseId}`;
}

export default function TrackRoom({ track, store, setStore, doneChapter = null }) {
  const saved = store.tracks[track.id];
  const answers = useMemo(() => saved?.answers || {}, [saved]);
  const allCases = useMemo(() => track.chapters.flatMap((ch, ci) => ch.cases.map(c => ({ ...c, chapterIndex: ci }))), [track]);
  const nextCase = allCases.find(c => !answers[c.id]) || null;
  const complete = !nextCase;
  const answered = allCases.filter(c => answers[c.id]).length;
  const summaryChapter = doneChapter !== null ? track.chapters[doneChapter] : null;

  useEffect(() => {
    if (!Object.keys(answers).length) trackEvent('track_start', { track: track.id }, { once: track.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);


  const nextTo = nextCase ? caseUrl(track, nextCase.id) : null;

  // Until the track is finished, the page is one chapter at a time: an opener, then the cases.
  if (!complete && summaryChapter) {
    return (
      <main className="track-page" style={{ '--track': track.color }}>
        <ChapterSummary track={track} chapter={summaryChapter} index={doneChapter} answers={answers} nextCase={nextCase} />
        <ChapterFeedback track={track} chapter={summaryChapter} index={doneChapter} />
      </main>
    );
  }
  if (!complete) {
    const ci = nextCase.chapterIndex;
    const ch = track.chapters[ci];
    const doneHere = ch.cases.filter(c => answers[c.id]).length;
    return (
      <main className="track-page" style={{ '--track': track.color }}>
        <section className="chapter-open rise">
          <span className="label">{track.title} · Chapter {ci + 1} of {track.chapters.length}</span>
          <h1 className="display chapter-open__title">{ch.title}</h1>
          <p className="chapter-open__tagline hand">{ch.tagline}</p>
          <i className="chapter-open__line" aria-hidden="true" />
          <p className="chapter-open__intro">{ch.intro}</p>
          <a href={nextTo} className="btn btn-orange" onClick={e => onLinkClick(e, nextTo)}>
            {doneHere ? `Continue chapter ${ci + 1}` : `Begin chapter ${ci + 1}`}
          </a>
          <p className="chapter-open__meta">
            {ch.cases.length} cases{doneHere ? ` · ${doneHere} done` : ''} · {answered} of {allCases.length} in this track
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="track-page" style={{ '--track': track.color }}>
      <header className="track-head rise">
        <span className="label">Track {track.number} · complete</span>
        <h1 className="display track-head__title">{track.title}</h1>
        <p className="track-head__sub hand">{track.subtitle}</p>
        <p className="track-head__blurb">{track.blurb}</p>
      </header>

      <TrackProfile track={track} answers={answers} onReplay={() => { setStore(resetTrack(track.id)); }} />

      <section className="board" aria-label="Chapters and cases">
        {track.chapters.map((ch, ci) => (
          <div key={ch.id} className="chapter">
            <div className="chapter__head">
              <span className="label">Chapter {ci + 1}</span>
              <h2 className="display">{ch.title}</h2>
              <p className="chapter__tagline hand">{ch.tagline}</p>
            </div>
            <ol className="cases">
              {ch.cases.map((c) => {
                const a = answers[c.id];
                const n = allCases.findIndex(x => x.id === c.id) + 1;
                const to = `${caseUrl(track, c.id)}?review=1`;
                return (
                  <li key={c.id}>
                    <a href={to} className={`case-card ${a ? `is-${a.verdict}` : ''}`} onClick={e => onLinkClick(e, to)}>
                      <span className="case-card__n">{String(n).padStart(2, '0')}</span>
                      <span className="case-card__body">
                        <b>{c.title}</b>
                        <span className="case-card__principle">{c.debrief.principle}</span>
                      </span>
                      <span className="case-card__meta">
                        {KIND_LABEL[c.kind] && <span className="tag">{KIND_LABEL[c.kind]}</span>}
                        {a && <span className={`tag tag--${a.verdict}`}>{VERDICT[a.verdict].label}</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>
    </main>
  );
}

// ─── Chapter result: score and what was covered ──────────────

function ChapterSummary({ track, chapter, index, answers, nextCase }) {
  const done = chapter.cases.filter(c => answers[c.id]);
  const strong = done.filter(c => answers[c.id].verdict === 'strong').length;
  const nextTo = nextCase ? caseUrl(track, nextCase.id) : null;
  const sameChapter = nextCase?.chapterIndex === index;
  const to = sameChapter ? nextTo : `/play/${track.id}`;
  return (
    <section className="chapter-summary rise" aria-label="Chapter result">
      <div className="chapter-summary__head">
        <div>
          <span className="label">Chapter {index + 1} complete</span>
          <h1 className="display">{chapter.title}</h1>
        </div>
        <div className="chapter-summary__score">
          <b>{strong}<span>/{done.length}</span></b>
          <span>strong calls</span>
        </div>
      </div>
      <div className="chapter-summary__bar" aria-hidden="true">
        {chapter.cases.map(c => <i key={c.id} className={`is-${answers[c.id]?.verdict || 'none'}`} />)}
      </div>
      <div>
        <span className="label">What you practised</span>
        <ul className="chapter-summary__list">
          {chapter.cases.map(c => {
            const a = answers[c.id];
            return (
              <li key={c.id}>
                <span className="chapter-summary__item">
                  <b>{c.debrief.principle}</b>
                  <span>{c.title}</span>
                </span>
                {a && <span className={`tag tag--${a.verdict}`}>{VERDICT[a.verdict].label}</span>}
              </li>
            );
          })}
        </ul>
      </div>
      {nextCase && (
        <a href={to} className="btn btn-orange chapter-summary__next" onClick={e => onLinkClick(e, to)}>
          {sameChapter ? `Next: ${nextCase.title}` : `On to chapter ${nextCase.chapterIndex + 1}`}
        </a>
      )}
    </section>
  );
}

// ─── Chapter feedback (goes to the Google Sheet + dashboard) ────────────────

const RATING_LABELS = ['', 'Rough', 'Okay', 'Good', 'Great', 'Loved it'];

function ChapterFeedback({ track, chapter, index }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!rating) return;
    const payload = {
      scope: 'chapter', trackId: track.id, trackLabel: track.title, chapterNum: index + 1,
      chapterTitle: chapter.title, chapterId: chapter.id, rating, comment: comment.trim(), savedAt: Date.now(),
    };
    fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
    trackEvent('feedback', { track: track.id, ch: index + 1, rating, comment: comment.trim() });
    setSent(true);
  };

  if (sent) {
    return (
      <section className="feedback-block rise" aria-label="Chapter feedback">
        <h2 className="display">Thank you.</h2>
        <p className="muted">Every rating goes straight to the person who writes these cases.</p>
      </section>
    );
  }

  return (
    <form className="feedback-block rise rise-2" onSubmit={submit} aria-label="Chapter feedback">
      <div>
        <h2 className="display">How was this chapter?</h2>
        <p className="muted">Your rating helps decide which cases get rewritten next.</p>
      </div>
      <div className="rating" role="radiogroup" aria-label="Rate this chapter">
        {[1, 2, 3, 4, 5].map(n => (
          <button type="button" key={n} role="radio" aria-checked={rating === n} className={`rating__btn ${rating === n ? 'is-on' : ''}`} onClick={() => setRating(n)}>
            <span className="rating__face" aria-hidden="true">{['😖', '😐', '🙂', '😄', '🤩'][n - 1]}</span>
            <span className="rating__label">{RATING_LABELS[n]}</span>
          </button>
        ))}
      </div>
      <textarea className="input" rows={3} maxLength={1000} placeholder="Anything confusing, wrong, or brilliant? (optional)" value={comment} onChange={e => setComment(e.target.value)} />
      <button type="submit" className="btn btn-primary" disabled={!rating}>Send feedback</button>
    </form>
  );
}

// ─── Track complete: design profile + share ─────────────────────────────────

function MeterBoard({ meters, range }) {
  return (
    <div className="meter-board">
      {METERS.map(({ key, label }) => {
        const v = meters[key] || 0;
        const pct = Math.min(50, (Math.abs(v) / Math.max(range, 1)) * 50);
        return (
          <div className="meter-line" key={key}>
            <span className="label">{label}</span>
            <div className="meter-line__track">
              <i className="meter-line__mid" />
              <i className={`meter-line__fill ${v < 0 ? 'is-neg' : ''}`} style={v >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }} />
            </div>
            <b>{v > 0 ? `+${v}` : v}</b>
          </div>
        );
      })}
    </div>
  );
}

function TrackProfile({ track, answers, onReplay }) {
  const cases = track.chapters.flatMap(ch => ch.cases).filter(c => answers[c.id]);
  const meters = sumMeters(answers);
  const rep = sumRep(answers);
  const counts = countVerdicts(answers);
  const archetype = getArchetype(meters);
  const verdicts = cases.map(c => answers[c.id].verdict);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const text = `I'm "${archetype.name}" on Casework: ${track.title}.\n${verdictStrip(verdicts.slice(0, 24))}\n${counts.strong}/${cases.length} strong calls. Learn design judgment from real situations:\n${siteUrl()}`;
  const cardArgs = { archetype, trackTitle: track.title, rep, verdicts, meters, color: track.color };

  useEffect(() => { markTrackComplete(track.id); trackEvent('track_done', { track: track.id }, { once: `done-${track.id}` }); }, [track.id]);
  useEffect(() => {
    let url;
    renderProfileCard(cardArgs).then(blob => { if (blob) { url = URL.createObjectURL(blob); setPreview(url); } });
    return () => url && URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype.key, rep, track.id]);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <section className="profile" id="profile">
      <div className="archetype">
        <span className="label">Your design profile · {track.title}</span>
        <h2 className="display archetype__name">{archetype.name}</h2>
        <p className="archetype__line">{archetype.line}</p>
        <div className="archetype__stats">
          <div><b>{rep}</b><span className="label">Rep</span></div>
          <div><b className="c-good">{counts.strong}</b><span className="label">Strong</span></div>
          <div><b className="c-mid">{counts.okay}</b><span className="label">Defensible</span></div>
          <div><b className="c-bad">{counts.costly}</b><span className="label">Costly</span></div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <span className="label">Share your profile</span>
          {preview && <img className="share-preview" src={preview} alt={`Casework profile card: ${archetype.name}`} />}
          <div className="share-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={async () => {
              const blob = await renderProfileCard(cardArgs);
              const how = await shareOrDownload(blob, `casework-${archetype.key}.png`, text);
              trackEvent('share', { where: how === 'shared' ? 'native' : 'card' });
              setToast(how === 'shared' ? 'Shared' : 'Card saved. Attach it to your post');
            }}>Save card</button>
            <a className="btn btn-ghost btn-sm" href={xIntent(text)} target="_blank" rel="noreferrer" onClick={() => trackEvent('share', { where: 'x' })}>Post on X</a>
            <a className="btn btn-ghost btn-sm" href={linkedInIntent(siteUrl())} target="_blank" rel="noreferrer" onClick={() => trackEvent('share', { where: 'linkedin' })}>LinkedIn</a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={async () => { trackEvent('share', { where: 'copy' }); setToast((await copyText(text)) ? 'Copied' : 'Copy failed'); }}>Copy text</button>
          </div>
        </div>
        <div className="card">
          <span className="label">What your decisions protected</span>
          <MeterBoard meters={meters} range={Math.max(8, cases.length)} />
          <div className="share-row">
            <a href="/playbook" className="btn btn-ghost btn-sm" onClick={e => onLinkClick(e, '/playbook')}>Open your playbook</a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onReplay}>Replay track</button>
          </div>
        </div>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
