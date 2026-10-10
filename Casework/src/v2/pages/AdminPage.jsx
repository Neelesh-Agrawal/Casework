// Private dashboard: who's playing, where they drop off, what they say. Key is checked server-side.
import { useCallback, useEffect, useState } from 'react';
import { DAILY_POOL, findCase, TRACKS, trackCases } from '../content';

const KEY = 'casework.adminKey';

function readKey() {
  try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; }
}

function Bars({ data, valueKey, labelKey, color = 'var(--ink)' }) {
  const max = Math.max(1, ...data.map(d => d[valueKey]));
  return (
    <div className="bars">
      {data.map(d => (
        <div key={d[labelKey]} className="bars__col" title={`${d[labelKey]}: ${d[valueKey]}`}>
          <i style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }} />
        </div>
      ))}
    </div>
  );
}

function Funnel({ track, data }) {
  const cases = trackCases(track);
  const c = data?.cases || {};
  const first = c[`${cases[0]?.id}:view`] || 0;
  return (
    <div className="card">
      <div className="row row--between">
        <h3 className="display">{track.title}</h3>
        <span className="muted">{data?.players || 0} players · {data?.starts || 0} starts · {data?.completes || 0} finished</span>
      </div>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Case</th><th>Reached</th><th>Answered</th><th>Drop here</th><th>Verdicts</th></tr>
        </thead>
        <tbody>
          {cases.map((cs, i) => {
            const views = c[`${cs.id}:view`] || 0;
            const answers = c[`${cs.id}:answer`] || 0;
            const nextViews = i < cases.length - 1 ? c[`${cases[i + 1].id}:view`] || 0 : answers;
            const drop = views ? Math.max(0, Math.round((1 - nextViews / views) * 100)) : 0;
            const reached = first ? Math.round((views / first) * 100) : 0;
            const s = c[`${cs.id}:strong`] || 0, o = c[`${cs.id}:okay`] || 0, x = c[`${cs.id}:costly`] || 0;
            const t = s + o + x || 1;
            return (
              <tr key={cs.id} className={drop >= 25 && views >= 10 ? 'is-hot' : ''}>
                <td className="mono">{i + 1}</td>
                <td>{cs.title}<span className="muted"> · ch{cs.chapterIndex + 1}{cs.kind !== 'decision' ? ` · ${cs.kind}` : ''}</span></td>
                <td><div className="mini-bar"><i style={{ width: `${reached}%` }} /></div>{views}</td>
                <td>{answers}</td>
                <td className={drop >= 25 && views >= 10 ? 'c-bad' : ''}>{views ? `${drop}%` : '-'}</td>
                <td>
                  <div className="verdict-bar">
                    <i className="is-strong" style={{ width: `${(s / t) * 100}%` }} />
                    <i className="is-okay" style={{ width: `${(o / t) * 100}%` }} />
                    <i className="is-costly" style={{ width: `${(x / t) * 100}%` }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const [key, setKey] = useState(readKey);
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async (k) => {
    try {
      const res = await fetch(`/api/admin?tracks=${TRACKS.map(t => t.id).join(',')}`, { headers: { 'x-admin-key': k } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setError(null);
      setData(json);
      try { sessionStorage.setItem(KEY, k); } catch { /* fine */ }
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  }, []);

  // Loading data on mount is the point of this effect; load() only sets state after the fetch resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (key) load(key); }, [key, load]);

  if (!data) {
    return (
      <main className="page page--narrow">
        <h1 className="display page-title">Admin</h1>
        <form className="card" onSubmit={e => { e.preventDefault(); setKey(input); load(input); }}>
          <label className="label" htmlFor="admin-key">Admin key</label>
          <input id="admin-key" className="input" type="password" value={input} onChange={e => setInput(e.target.value)} autoFocus />
          <button type="submit" className="btn btn-primary btn-sm">Open dashboard</button>
          {error && <p className="c-bad">{error}</p>}
        </form>
      </main>
    );
  }

  if (!data.configured) {
    return <main className="page"><h1 className="display page-title">Admin</h1><p className="muted">The database isn't connected yet. Add Upstash Redis in Vercel → Storage.</p></main>;
  }

  const visitors = data.days.reduce((n, d) => n + d.visitors, 0);
  const views = data.days.reduce((n, d) => n + d.views, 0);
  const dailyPlays = data.days.reduce((n, d) => n + (d.daily.answers || 0), 0);
  const ratingCount = Object.values(data.ratings).reduce((a, b) => a + b, 0);
  const ratingAvg = ratingCount ? Object.entries(data.ratings).reduce((s, [r, c]) => s + Number(r) * c, 0) / ratingCount : 0;

  return (
    <main className="page page--wide admin">
      <div className="row row--between">
        <h1 className="display page-title">Dashboard</h1>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(key)}>Refresh</button>
      </div>

      <div className="stat-grid">
        <div className="stat"><b>{visitors}</b><span className="label">visitors · 30 days</span></div>
        <div className="stat"><b>{views}</b><span className="label">visits · 30 days</span></div>
        <div className="stat"><b>{dailyPlays}</b><span className="label">daily cases played</span></div>
        <div className="stat"><b>{ratingCount ? ratingAvg.toFixed(1) : '-'}</b><span className="label">avg rating ({ratingCount})</span></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <span className="label">Visitors per day</span>
          <Bars data={data.days} valueKey="visitors" labelKey="day" color="var(--orange)" />
        </div>
        <div className="card">
          <span className="label">Daily case: opened vs answered</span>
          <Bars data={data.days.map(d => ({ day: d.day, n: d.daily.views || 0 }))} valueKey="n" labelKey="day" color="var(--line-2)" />
          <Bars data={data.days.map(d => ({ day: d.day, n: d.daily.answers || 0 }))} valueKey="n" labelKey="day" color="var(--blue)" />
        </div>
      </div>

      <div className="card">
        <span className="label">Daily cases</span>
        <table className="table">
          <thead><tr><th>Date</th><th>Case</th><th>Opened</th><th>Answered</th><th>Strong</th></tr></thead>
          <tbody>
            {[...data.days].reverse().filter(d => d.daily.views).map(d => {
              const found = d.daily.case && findCase(d.daily.case);
              return (
                <tr key={d.day}>
                  <td className="mono">{d.day}</td>
                  <td>{found?.caseData.title || d.daily.case}</td>
                  <td>{d.daily.views || 0}</td>
                  <td>{d.daily.answers || 0}</td>
                  <td>{d.daily.answers ? `${Math.round(((d.daily.strong || 0) / d.daily.answers) * 100)}%` : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">{DAILY_POOL.length} cases in the daily pool.</p>
      </div>

      {TRACKS.map(t => <Funnel key={t.id} track={t} data={data.tracks[t.id]} />)}

      <div className="grid-2">
        <div className="card">
          <span className="label">Feedback ({data.feedback.length})</span>
          <div className="feedback-list">
            {data.feedback.length === 0 && <p className="muted">No feedback yet.</p>}
            {data.feedback.map((f, i) => (
              <div key={i} className="feedback-item">
                <span>{['😖', '😐', '🙂', '😄', '🤩'][f.rating - 1]}</span>
                <div>
                  <span className="muted mono">{new Date(f.at).toLocaleDateString()} · {f.track} ch{f.ch}</span>
                  {f.comment && <p>{f.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <span className="label">Shares</span>
          {Object.keys(data.shares).length === 0 && <p className="muted">No shares yet.</p>}
          {Object.entries(data.shares).map(([k, v]) => <p key={k}><b>{v}</b> <span className="muted">{k}</span></p>)}
        </div>
      </div>
    </main>
  );
}
