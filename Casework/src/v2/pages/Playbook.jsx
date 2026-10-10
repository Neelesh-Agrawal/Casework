// Everything the player has learned: each principle with its rule of thumb, grouped by track.
// Cases they missed come back in review.
import { useMemo, useState } from 'react';
import { findCase, TRACKS } from '../content';
import { VERDICT } from '../engine/scoring';
import { navigate, onLinkClick } from '../ui/router';

function collect(store) {
  const entries = [];
  for (const [trackId, t] of Object.entries(store.tracks)) {
    for (const [caseId, a] of Object.entries(t.answers || {})) {
      const found = findCase(caseId);
      if (found) entries.push({ caseData: found.caseData, track: found.track, answer: a, trackId, url: `/play/${trackId}/${caseId}` });
    }
  }
  for (const [day, a] of Object.entries(store.daily.history || {})) {
    const found = findCase(a.caseId);
    if (found) entries.push({ caseData: found.caseData, track: found.track, answer: a, trackId: 'daily', url: null, day });
  }
  return entries.sort((x, y) => (y.answer.at || 0) - (x.answer.at || 0));
}

export default function Playbook({ store }) {
  const all = useMemo(() => collect(store), [store]);
  const [filter, setFilter] = useState('all');
  const review = all.filter(e => e.answer.verdict !== 'strong' && e.url);
  const strong = all.filter(e => e.answer.verdict === 'strong').length;
  const shown = filter === 'review' ? review : all;

  // Group by track, in track order, with Daily last.
  const groups = [...TRACKS.map(t => t.id), 'daily']
    .map(id => ({ id, title: id === 'daily' ? 'Daily cases' : TRACKS.find(t => t.id === id)?.title, color: TRACKS.find(t => t.id === id)?.color, items: shown.filter(e => e.trackId === id) }))
    .filter(g => g.items.length);

  return (
    <main className="page page--wide playbook">
      <div className="rise">
        <span className="label">Your playbook</span>
        <h1 className="display page-title">{all.length ? 'What you have learned' : 'Your playbook starts with one case'}</h1>
        <p className="muted">Every principle you practise is kept here with one rule of thumb, so you can scan it before a review or a hard meeting.</p>
      </div>

      {all.length === 0 ? (
        <div className="card empty rise rise-2">
          <p>Play any case and its principle is added here automatically.</p>
          <div className="share-row">
            <a href="/play/ux" className="btn btn-orange btn-sm" onClick={e => onLinkClick(e, '/play/ux')}>Start UX Thinking</a>
            <a href="/daily" className="btn btn-ghost btn-sm" onClick={e => onLinkClick(e, '/daily')}>Today's case</a>
          </div>
        </div>
      ) : (
        <>
          <div className="playbook__bar rise rise-2">
            <div className="playbook__stats">
              <div><b>{all.length}</b><span>principles</span></div>
              <div><b className="c-good">{strong}</b><span>strong calls</span></div>
              <div><b className="c-bad">{review.length}</b><span>to review</span></div>
            </div>
            {review.length > 0 && (
              <button type="button" className="btn btn-orange" onClick={() => navigate(`${review[0].url}?review=1`)}>Review {review.length} {review.length === 1 ? 'case' : 'cases'}</button>
            )}
          </div>

          <div className="filters rise rise-2" role="tablist" aria-label="Filter">
            {[['all', 'All'], ['review', 'Needs review']].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={filter === id} className={`filter ${filter === id ? 'is-on' : ''}`} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>

          {groups.length === 0 && <p className="muted">Nothing to review. Every call you made was a strong one.</p>}
          {groups.map(g => (
            <section key={g.id} className="pb-group" style={{ '--track': g.color || 'var(--orange)' }}>
              <h2 className="pb-group__title">{g.title} <span className="muted">· {g.items.length}</span></h2>
              <ul className="pb-list">
                {g.items.map(e => <Row key={`${e.trackId}-${e.caseData.id}`} entry={e} />)}
              </ul>
            </section>
          ))}
        </>
      )}
    </main>
  );
}

function Row({ entry }) {
  const { caseData, answer } = entry;
  const to = entry.url ? `${entry.url}?review=1` : null;
  return (
    <li className="pb-row">
      <span className={`dot dot--${answer.verdict}`} title={VERDICT[answer.verdict].label} />
      <div className="pb-row__body">
        <b>{caseData.debrief.principle}</b>
        {caseData.takeaway && <p>{caseData.takeaway}</p>}
        <span className="pb-row__case">{caseData.title} · {VERDICT[answer.verdict].label}</span>
      </div>
      {to && <a href={to} className="link-btn" onClick={e => onLinkClick(e, to)}>{answer.verdict === 'strong' ? 'Replay' : 'Try again'}</a>}
    </li>
  );
}
