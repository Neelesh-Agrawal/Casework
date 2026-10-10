import { useEffect, useState } from 'react';
import Lesson from '../player/Lesson';
import { saveDaily } from '../engine/store';
import { dateKey, previousDateKey } from '../engine/daily';
import { track as trackEvent } from '../engine/analytics';
import { VERDICT } from '../engine/scoring';
import { fetchVotes, MIN_VOTES_TO_SHOW, totalVotes } from '../engine/stats';
import { copyText, siteUrl, xIntent } from '../ui/share';
import { navigate, onLinkClick } from '../ui/router';
import { WeekStrip } from './DailyHistory';

export default function DailyPage({ daily, store, setStore, streak }) {
  const today = dateKey();
  const entry = store.daily.history[today];
  const [mode, setMode] = useState(entry ? 'result' : 'play');

  useEffect(() => {
    if (daily) trackEvent('daily_view', { case: daily.caseData.id }, { once: `daily-${today}` });
  }, [daily, today]);

  if (!daily) {
    return (
      <main className="page page--narrow">
        <h1 className="display page-title">The first Daily Case is on its way.</h1>
        <p className="muted">Check back soon. There is a new case every day.</p>
      </main>
    );
  }

  if (mode === 'play' || !entry) {
    return (
      <Lesson
        key={`daily-${daily.number}`}
        caseData={daily.caseData}
        kicker={`Daily case #${daily.number}`}
        priorAnswer={entry}
        nextLabel="Your result"
        onResolved={(answer) => {
          setStore(saveDaily(today, previousDateKey(), { caseId: daily.caseData.id, number: daily.number, title: daily.caseData.title, ...answer }));
          trackEvent('daily_answer', { case: daily.caseData.id, verdict: answer.verdict });
        }}
        onNext={() => { setMode('result'); window.scrollTo({ top: 0 }); }}
      />
    );
  }

  return <DailyResult daily={daily} entry={entry} streak={streak} store={store} onReview={() => setMode('play')} />;
}

function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

function useCountdown() {
  const [left, setLeft] = useState(() => nextMidnight() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(nextMidnight() - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3.6e6);
  const m = Math.floor((left % 3.6e6) / 6e4);
  const s = Math.floor((left % 6e4) / 1000);
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function DailyResult({ daily, entry, streak, store, onReview }) {
  const [votes, setVotes] = useState(null);
  const [toast, setToast] = useState(null);
  const countdown = useCountdown();

  useEffect(() => { fetchVotes(daily.caseData.id).then(setVotes); }, [daily.caseData.id]);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const total = totalVotes(votes);
  const agreed = total >= MIN_VOTES_TO_SHOW && entry.choiceId ? Math.round(((votes[entry.choiceId] || 0) / total) * 100) : null;
  const strongId = daily.caseData.choices?.find(c => c.verdict === 'strong')?.id;
  const nailed = total >= MIN_VOTES_TO_SHOW && strongId ? Math.round(((votes[strongId] || 0) / total) * 100) : null;
  const mark = { strong: '🟩', okay: '🟨', costly: '🟥' }[entry.verdict];

  const text = [
    `Casework Daily #${daily.number} ${mark}`,
    `"${daily.caseData.title}"`,
    `${VERDICT[entry.verdict].label}${streak > 1 ? ` · 🔥 ${streak}-day streak` : ''}`,
    agreed !== null ? `${agreed}% of designers chose what I chose.` : null,
    'What would you do?',
    `${siteUrl()}/daily`,
  ].filter(Boolean).join('\n');

  return (
    <main className="page page--narrow">
      <div className={`daily-result rise daily-result--${entry.verdict}`}>
        <span className="label">Daily case #{daily.number}</span>
        <h1 className="display page-title">{daily.caseData.title}</h1>
        <div className="daily-result__verdict">
          <span className={`tag tag--${entry.verdict}`}>{VERDICT[entry.verdict].label}</span>
          {streak > 0 && <span className="streak-big">🔥 {streak}-day streak</span>}
        </div>
        <div className="stat-row">
          <div className="stat"><b>{agreed !== null ? `${agreed}%` : '-'}</b><span className="label">chose what you chose</span></div>
          <div className="stat"><b>{nailed !== null ? `${nailed}%` : '-'}</b><span className="label">made the strong call</span></div>
          <div className="stat"><b>{total || '-'}</b><span className="label">designers today</span></div>
        </div>
        {total < MIN_VOTES_TO_SHOW && <p className="votes-note">Results fill in as more designers play today.</p>}
      </div>

      <div className="card rise rise-2">
        <span className="label">Share your result</span>
        <pre className="share-text">{text}</pre>
        <div className="share-row">
          <button type="button" className="btn btn-primary btn-sm" onClick={async () => { trackEvent('share', { where: 'copy' }); setToast((await copyText(text)) ? 'Copied. Paste it anywhere' : 'Copy failed'); }}>Copy result</button>
          <a className="btn btn-ghost btn-sm" href={xIntent(text)} target="_blank" rel="noreferrer" onClick={() => trackEvent('share', { where: 'x' })}>Post on X</a>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReview}>Review the case</button>
        </div>
      </div>

      <div className="card rise rise-3">
        <div className="row row--between">
          <span className="label">Your week</span>
          <a href="/me" className="link" onClick={e => onLinkClick(e, '/me')}>All your stats →</a>
        </div>
        <WeekStrip history={store.daily.history} />
        <p className="muted next-case">Next case in <b className="mono">{countdown}</b></p>
      </div>

      <div className="panel-actions">
        <button type="button" className="btn btn-orange" onClick={() => navigate('/')}>Play a track while you wait →</button>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
