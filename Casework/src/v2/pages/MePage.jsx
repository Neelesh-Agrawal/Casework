import { WeekStrip, MonthCalendar } from './DailyHistory';
import { countVerdicts, getArchetype, sumMeters, VERDICT } from '../engine/scoring';
import { trackCases } from '../content';
import { onLinkClick } from '../ui/router';

export default function MePage({ store, tracks, streak }) {
  const allAnswers = Object.values(store.tracks).reduce((acc, t) => ({ ...acc, ...(t.answers || {}) }), {});
  const dailyEntries = Object.entries(store.daily.history).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const dailyAnswers = Object.fromEntries(dailyEntries.map(([k, e]) => [`d-${k}`, e]));
  const everything = { ...allAnswers, ...dailyAnswers };
  const played = Object.keys(everything).length;
  const counts = countVerdicts(everything);
  const strongRate = played ? Math.round((counts.strong / played) * 100) : 0;
  const archetype = played >= 5 ? getArchetype(sumMeters(everything)) : null;

  return (
    <main className="page">
      <div className="rise">
        <span className="label">Your desk</span>
        <h1 className="display page-title">{played ? 'How you make the call' : 'Your desk is empty for now'}</h1>
        <p className="muted">Everything here lives in this browser. No account, no tracking of who you are.</p>
      </div>

      <div className="stat-grid rise rise-2">
        <div className="stat stat--hero"><b>🔥 {streak}</b><span className="label">day streak</span></div>
        <div className="stat"><b>{store.daily.best || 0}</b><span className="label">best streak</span></div>
        <div className="stat"><b>{played}</b><span className="label">cases played</span></div>
        <div className="stat"><b>{played ? `${strongRate}%` : '-'}</b><span className="label">strong calls</span></div>
      </div>

      <div className="card daily-card rise rise-3">
        <div className="daily-card__week">
          <span className="label">Daily cases · this week</span>
          <WeekStrip history={store.daily.history} />
        </div>
        <MonthCalendar history={store.daily.history} />
      </div>

      {archetype && (
        <div className="archetype archetype--small rise rise-3">
          <span className="label">Your design profile so far</span>
          <h2 className="display archetype__name">{archetype.name}</h2>
          <p className="archetype__line">{archetype.line}</p>
        </div>
      )}

      <div className="card rise rise-4">
        <span className="label">Tracks</span>
        <div className="progress-list">
          {tracks.filter(t => t.released).map(t => {
            const cases = trackCases(t);
            const answered = cases.filter(c => store.tracks[t.id]?.answers?.[c.id]).length;
            return (
              <a key={t.id} href={`/play/${t.id}`} className="progress-item" style={{ '--track': t.color }} onClick={e => onLinkClick(e, `/play/${t.id}`)}>
                <b>{t.title}</b>
                <div className="track__bar"><span style={{ width: `${(answered / cases.length) * 100}%` }} /></div>
                <span className="label">{answered}/{cases.length}</span>
              </a>
            );
          })}
        </div>
      </div>

      {dailyEntries.length > 0 && (
        <div className="card rise rise-5">
          <span className="label">Daily history</span>
          <div className="recap">
            {dailyEntries.slice(0, 30).map(([k, e]) => (
              <div className="recap__row" key={k}>
                <span className="mono muted">#{e.number || '-'}</span>
                <div><b>{e.title || e.caseId}</b><span className="muted">{new Date(k).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span></div>
                <span className={`tag tag--${e.verdict}`}>{VERDICT[e.verdict].label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
