// Private dashboard: who's playing, when, where they drop off, what they say. Key is checked server-side.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DAILY_POOL, findCase, TRACKS, trackCases } from '../content';
import { OWNER_KEY } from '../engine/analytics';

const KEY = 'casework.adminKey';
const RANGE_KEY = 'casework.adminRange';
const ALL_START = '2026-10-01'; // tracking went live in October 2026
const DAY_MS = 86400000;

const RANGES = [
  { id: '24h', label: '24 hours', short: '24h' },
  { id: '7d', label: '7 days', short: '7d', days: 7 },
  { id: '30d', label: '30 days', short: '30d', days: 30 },
  { id: '90d', label: '90 days', short: '90d', days: 90 },
  { id: 'all', label: 'All time', short: 'All' },
  { id: 'custom', label: 'Custom', short: 'Custom' },
];

const session = {
  get(k, fallback) { try { return JSON.parse(sessionStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* fine */ } },
};

const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);
const todayUtc = () => isoDay(Date.now());
const sum = (arr, fn) => arr.reduce((n, x) => n + (Number(fn(x)) || 0), 0);
const hh = (n) => String(n).padStart(2, '0');
const fmtDay = (iso, opts = { day: 'numeric', month: 'short' }) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(undefined, opts);
const offsetMin = -new Date().getTimezoneOffset();
const fmtTime = (date) => date.toLocaleTimeString(undefined, { hour: 'numeric', ...(offsetMin % 60 ? { minute: '2-digit' } : {}) });
const hourDate = (key) => new Date(`${key}:00:00Z`); // "YYYY-MM-DDTHH" (UTC) -> Date

function rangeParams(range) {
  const to = todayUtc();
  if (range.id === '24h') return { from: isoDay(Date.now() - DAY_MS), to, hours: '1', compare: '0' };
  if (range.id === 'all') return { from: ALL_START, to, compare: '0' };
  if (range.id === 'custom') return { from: range.from || isoDay(Date.now() - 6 * DAY_MS), to: range.to || to };
  return { from: isoDay(Date.now() - (range.days - 1) * DAY_MS), to };
}

function Delta({ cur, prev, label }) {
  if (prev === null || prev === undefined) return null;
  if (!prev) return cur ? <span className="delta is-up" title={`was 0 in the ${label}`}>up from 0</span> : null;
  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) return <span className="delta">same as before</span>;
  return <span className={`delta ${pct > 0 ? 'is-up' : 'is-down'}`} title={`was ${prev} in the ${label}`}>{pct > 0 ? '+' : ''}{pct}% vs before</span>;
}

function Stat({ value, label, hint, delta }) {
  return (
    <div className="stat">
      <b>{value}</b>
      <span className="label">{label}</span>
      {hint && <span className="stat__hint">{hint}</span>}
      {delta}
    </div>
  );
}

/**
 * Bar chart with a scale, axis labels and a tap/hover card.
 * buckets: [{ id, axis, title, ...values }]; series: [{ key, label, color }].
 * stacked: series sit on top of each other (otherwise side by side).
 */
function Chart({ buckets, series, stacked = false, summary, tipExtra, highlightMax = false }) {
  const [hover, setHover] = useState(null);
  const shown = series.filter(s => buckets.some(b => b[s.key] > 0));
  const visible = shown.length ? shown : series.slice(0, 1);
  const total = (b) => sum(visible, s => b[s.key]);
  const max = Math.max(1, ...buckets.map(b => (stacked ? total(b) : Math.max(...visible.map(s => b[s.key] || 0)))));
  const top = max <= 1 ? 1 : max <= 4 ? max + (max % 2) : Math.ceil(max / 4) * 4;
  const ticks = top === 1 ? [1, 0] : [top, top / 2, 0];
  const every = buckets.length <= 8 ? 1 : Math.ceil(buckets.length / 6);
  const peak = highlightMax ? Math.max(...buckets.map(total)) : -1;
  const h = hover !== null ? buckets[hover] : null;
  return (
    <div className={`chart ${highlightMax ? 'chart--peak' : ''}`}>
      <div className="chart__head">
        {summary && <div className="chart__summary">{summary}</div>}
        {visible.length > 1 && (
          <div className="chart__legend">
            {visible.map(s => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}
          </div>
        )}
      </div>
      <div className="chart__body">
        <div className="chart__axis">{ticks.map(t => <span key={t}>{t}</span>)}</div>
        <div className="chart__plot" onMouseLeave={() => setHover(null)}>
          {ticks.map(t => <i key={t} className="chart__grid" style={{ bottom: `${(t / top) * 100}%` }} />)}
          <div className="chart__cols">
            {buckets.map((b, i) => (
              <div
                key={b.id}
                className={`chart__col ${hover === i ? 'is-on' : ''} ${peak > 0 && total(b) === peak ? 'is-peak' : ''}`}
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(hover === i ? null : i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                aria-label={`${b.title}: ${visible.map(s => `${b[s.key] || 0} ${s.label.toLowerCase()}`).join(', ')}`}
              >
                <div className={`chart__bars ${stacked ? 'is-stacked' : ''}`}>
                  {stacked && total(b) > 0 && buckets.length <= 14 && <b className="chart__total" style={{ bottom: `${(total(b) / top) * 100}%` }}>{total(b)}</b>}
                  {visible.map(s => (
                    <i key={s.key} className={b[s.key] ? '' : 'is-zero'} style={{ height: `${((b[s.key] || 0) / top) * 100}%`, background: s.color }}>
                      {!stacked && visible.length === 1 && b[s.key] > 0 && buckets.length <= 14 && <b>{b[s.key]}</b>}
                    </i>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {h && (
            <div className="chart__tip" style={{ left: `${Math.min(80, Math.max(20, ((hover + 0.5) / buckets.length) * 100))}%` }}>
              <b>{h.title}</b>
              {visible.map(s => <span key={s.key}><i style={{ background: s.color }} />{s.label}: <b>{h[s.key] || 0}</b></span>)}
              {tipExtra?.(h)}
            </div>
          )}
        </div>
      </div>
      <div className="chart__dates">
        {/* On phones every other label is hidden (see .is-alt) so they never collide. */}
        {buckets.map((b, i) => <span key={b.id} className={every > 1 && (i / every) % 2 === 1 ? 'is-alt' : ''}>{i % every === 0 ? b.axis : ''}</span>)}
      </div>
    </div>
  );
}

function Funnel({ track, data }) {
  const cases = trackCases(track);
  const c = data?.cases || {};
  const first = c[`${cases[0]?.id}:view`] || 0;
  return (
    <div className="card">
      <div className="funnel__head">
        <h3 className="display">{track.title}</h3>
        <span className="muted">{data?.players || 0} players · {data?.starts || 0} starts · {data?.completes || 0} finished</span>
      </div>
      <div className="table-wrap">
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
                  <td className="nowrap"><div className="mini-bar"><i style={{ width: `${reached}%` }} /></div>{views}</td>
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
    </div>
  );
}

const SERIES_VISITORS = [
  { key: 'returning', label: 'Returning', color: 'var(--orange)' },
  { key: 'fresh', label: 'New', color: 'var(--blue)' },
  { key: 'untold', label: 'Visitors (before new/returning was tracked)', color: 'var(--line-2)' },
];

/** Turns the raw API payload into numbers for the selected range. */
function summarise(data, rangeId) {
  const cur = data.days.filter(d => !d.prev);
  const prev = data.days.filter(d => d.prev);
  const since = data.newSince;
  const tracked = (day) => Boolean(since) && day >= since;
  const hourly = rangeId === '24h';

  let buckets, visits, visitsPrev, fresh, freshPrev, answers, answersPrev, visitors, visitorsPrev, splitOk;
  if (hourly) {
    const act = Object.fromEntries(data.days.map(d => [d.day, d.act]));
    const rows = data.hours.map(({ hour, visitors: v }) => {
      const [day, H] = hour.split('T');
      const a = act[day] || {};
      const date = hourDate(hour);
      const n = Number(a[`n${H}`]) || 0;
      const known = tracked(day);
      return {
        id: hour, day, axis: fmtTime(date),
        title: `${date.toLocaleDateString(undefined, { weekday: 'short' })} ${fmtTime(date)} to ${fmtTime(new Date(date.getTime() + 3600000))}`,
        visitors: v, visits: Number(a[`h${H}`]) || 0, answers: Number(a[`a${H}`]) || 0,
        fresh: known ? Math.min(n, v) : 0, returning: known ? Math.max(0, v - n) : 0, untold: known ? 0 : v,
      };
    });
    const last = rows.slice(24), before = rows.slice(0, 24);
    buckets = last;
    visits = sum(last, r => r.visits); visitsPrev = sum(before, r => r.visits);
    fresh = sum(last, r => r.fresh); freshPrev = sum(before, r => r.fresh);
    answers = sum(last, r => r.answers); answersPrev = sum(before, r => r.answers);
    visitors = data.unique24?.cur || 0; visitorsPrev = data.unique24?.prev ?? null;
    splitOk = last.every(r => tracked(r.day));
  } else {
    buckets = cur.map(d => {
      const n = Number(d.act.new) || 0;
      const known = tracked(d.day);
      return {
        id: d.day, day: d.day, axis: fmtDay(d.day), title: fmtDay(d.day, { weekday: 'short', day: 'numeric', month: 'short' }),
        visitors: d.visitors, visits: d.visits,
        fresh: known ? Math.min(n, d.visitors) : 0, returning: known ? Math.max(0, d.visitors - n) : 0, untold: known ? 0 : d.visitors,
        opened: d.daily.views || 0, answered: d.daily.answers || 0,
      };
    });
    visits = sum(cur, d => d.visits); visitsPrev = prev.length ? sum(prev, d => d.visits) : null;
    fresh = sum(cur, d => d.act.new); freshPrev = prev.length ? sum(prev, d => d.act.new) : null;
    answers = sum(cur, d => d.act.answers); answersPrev = prev.length ? sum(prev, d => d.act.answers) : null;
    visitors = data.unique.cur; visitorsPrev = data.unique.prev;
    splitOk = Boolean(since) && since <= data.range.from;
    if (prev.length && !(since && since <= data.range.prevFrom)) freshPrev = null;
  }
  // Someone who came on several days counts once in `visitors`, and new people are counted once ever,
  // so whoever is left had already been here before the range started (or came back within it).
  let returning = splitOk ? Math.max(0, visitors - fresh) : null;
  let returningFrom = null;
  if (!hourly && !splitOk && data.unique.trackedFrom) {
    // Range starts before tracking began: count over the tracked part only, and say so.
    returning = Math.max(0, data.unique.tracked - fresh);
    returningFrom = data.unique.trackedFrom;
  }

  // When people show up: visits per hour of day (in local time), and per weekday.
  const byHour = Array.from({ length: 24 }, (_, H) => {
    const date = new Date(Date.UTC(2026, 0, 5, H));
    const local = (H * 60 + offsetMin + 1440) % 1440;
    return {
      id: `h${H}`, local, axis: fmtTime(date), title: `${fmtTime(date)} to ${fmtTime(new Date(date.getTime() + 3600000))}`,
      visits: hourly ? sum(buckets.filter(b => b.id.endsWith(`T${hh(H)}`)), b => b.visits) : sum(cur, d => d.act[`h${hh(H)}`]),
    };
  }).sort((a, b) => a.local - b.local);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, i) => {
    const days = cur.filter(d => (new Date(`${d.day}T12:00:00Z`).getUTCDay() + 6) % 7 === i);
    return { id: name, axis: name, title: `${name} (${days.length} in range)`, visits: days.length ? Math.round(sum(days, d => d.visits) / days.length * 10) / 10 : 0 };
  });

  return { buckets, visits, visitsPrev, visitors, visitorsPrev, fresh, freshPrev, returning, returningFrom, answers, answersPrev, byHour, weekdays, splitOk };
}

export default function AdminPage() {
  const [key, setKey] = useState(() => session.get(KEY, ''));
  const [input, setInput] = useState('');
  const [range, setRange] = useState(() => session.get(RANGE_KEY, { id: '7d', days: 7 }));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(() => { try { return localStorage.getItem(OWNER_KEY) === '1'; } catch { return false; } });

  const load = useCallback(async (k, r) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tracks: TRACKS.map(t => t.id).join(','), ...rangeParams(r) });
      const res = await fetch(`/api/admin?${params}`, { headers: { 'x-admin-key': k } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setError(null);
      setData({ ...json, rangeId: r.id });
      session.set(KEY, k);
      // First successful login on this browser: stop counting your own visits.
      try { if (localStorage.getItem(OWNER_KEY) === null) { localStorage.setItem(OWNER_KEY, '1'); setOwner(true); } } catch { /* fine */ }
    } catch (e) {
      setError(e.message);
      setData(d => (d && k === key ? d : null));
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Loading data when the key or range changes is the point of this effect; load() sets state after the fetch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (key) load(key, range); }, [key, range]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (r) => { setRange(r); session.set(RANGE_KEY, r); };
  const toggleOwner = () => {
    const next = !owner;
    try { localStorage.setItem(OWNER_KEY, next ? '1' : '0'); } catch { /* fine */ }
    setOwner(next);
  };

  // Draw from the range the data was fetched for, so switching ranges never mixes old data with the new layout.
  const rid = data?.rangeId;
  const s = useMemo(() => (data?.configured ? summarise(data, rid) : null), [data, rid]);

  if (!data) {
    return (
      <main className="page page--narrow">
        <h1 className="display page-title">Admin</h1>
        <form className="card" onSubmit={e => { e.preventDefault(); setKey(input); }}>
          <label className="label" htmlFor="admin-key">Admin key</label>
          <input id="admin-key" className="input" type="password" value={input} onChange={e => setInput(e.target.value)} autoFocus />
          <button type="submit" className="btn btn-primary btn-sm">{loading ? 'Opening…' : 'Open dashboard'}</button>
          {error && <p className="c-bad">{error}</p>}
        </form>
      </main>
    );
  }

  if (!data.configured) {
    return <main className="page"><h1 className="display page-title">Admin</h1><p className="muted">The database isn't connected yet. Add Upstash Redis in Vercel → Storage.</p></main>;
  }

  const meta = RANGES.find(r => r.id === range.id) || RANGES[1];
  const prevLabel = rid === '24h' ? 'previous 24h' : data.range.prevFrom ? 'previous period' : null;
  const fromMs = rid === '24h' ? hourDate(data.hours[24].hour).getTime() : Date.parse(`${data.range.from}T00:00:00Z`);
  const feedback = data.feedback.filter(f => f.at >= fromMs);
  const rated = feedback.filter(f => f.rating);
  const ratingAvg = rated.length ? sum(rated, f => f.rating) / rated.length : 0;
  const daily = data.days.filter(d => !d.prev);
  const dailyOpened = sum(daily, d => d.daily.views);
  const dailyAnswered = sum(daily, d => d.daily.answers);
  const peakHour = s.byHour.reduce((a, b) => (b.visits > a.visits ? b : a), s.byHour[0]);
  const peakDay = s.buckets.reduce((a, b) => (b.visitors > a.visitors ? b : a), s.buckets[0]);
  const splitNote = data.newSince
    ? `New vs returning is counted from ${fmtDay(data.newSince, { day: 'numeric', month: 'short', year: 'numeric' })}. Pick a range that starts on or after that day.`
    : 'New vs returning starts counting with this update. Check back after a few visits.';

  return (
    <main className="page page--wide admin">
      <header className="admin__head">
        <div>
          <h1 className="display page-title">Dashboard</h1>
          <p className="muted admin__sub">
            {rid === '24h' ? 'Last 24 hours' : `${fmtDay(data.range.from)} to ${fmtDay(data.range.to)}`}
            {loading ? ' · loading…' : ''}
          </p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(key, range)} disabled={loading}>Refresh</button>
      </header>

      <div className="seg" role="tablist" aria-label="Time range">
        {RANGES.map(r => (
          <button
            key={r.id} type="button" role="tab" aria-selected={meta.id === r.id}
            className={`seg__btn ${meta.id === r.id ? 'is-on' : ''}`}
            onClick={() => pick(r.id === 'custom' ? { id: 'custom', from: isoDay(Date.now() - 6 * DAY_MS), to: todayUtc() } : r)}
          >
            <span className="seg__long">{r.label}</span><span className="seg__short">{r.short}</span>
          </button>
        ))}
      </div>
      {range.id === 'custom' && (
        <div className="custom-range">
          <label><span className="label">From</span>
            <input className="input" type="date" min={ALL_START} max={range.to} value={range.from} onChange={e => e.target.value && pick({ ...range, from: e.target.value })} />
          </label>
          <label><span className="label">To</span>
            <input className="input" type="date" min={range.from} max={todayUtc()} value={range.to} onChange={e => e.target.value && pick({ ...range, to: e.target.value })} />
          </label>
        </div>
      )}
      {error && <p className="c-bad">{error}</p>}

      <div className="stat-grid stat-grid--admin">
        <Stat value={s.visitors} label="Visitors" hint="different people" delta={<Delta cur={s.visitors} prev={s.visitorsPrev} label={prevLabel} />} />
        <Stat value={s.visits} label="Visits" hint="times the site was opened" delta={<Delta cur={s.visits} prev={s.visitsPrev} label={prevLabel} />} />
        <Stat value={data.newSince ? s.fresh : '-'} label="New visitors" hint="first time ever" delta={data.newSince && <Delta cur={s.fresh} prev={s.freshPrev} label={prevLabel} />} />
        <Stat
          value={s.returning ?? '-'} label="Returning visitors"
          hint={s.returningFrom
            ? `since ${fmtDay(s.returningFrom)}, when this started counting`
            : s.returning !== null && s.visitors ? `${Math.round((s.returning / s.visitors) * 100)}% of visitors` : 'been here before'}
        />
        <Stat value={s.answers} label="Cases answered" hint="tracks + daily" delta={<Delta cur={s.answers} prev={s.answersPrev} label={prevLabel} />} />
        <Stat value={rated.length ? ratingAvg.toFixed(1) : '-'} label="Avg rating" hint={`${rated.length} ${rated.length === 1 ? 'rating' : 'ratings'}`} />
      </div>
      {!s.splitOk && !s.returningFrom && <p className="muted admin__note">{splitNote}</p>}

      <details className="card explain">
        <summary>What do these numbers mean?</summary>
        <dl>
          <dt>Visitors</dt><dd>Different people (strictly: different browsers). Someone who opens Casework 5 times in the range counts as 1.</dd>
          <dt>Visits</dt><dd>Every time someone opens or reloads the site. 1 person opening it on Monday and again on Friday is 2 visits. Visits ÷ visitors tells you how often people come back.</dd>
          <dt>New visitors</dt><dd>People whose browser had never opened Casework before. Each person is new only once, ever.</dd>
          <dt>Returning visitors</dt><dd>Visitors in the range who had been here before (an earlier day, or earlier in the range). Visitors minus new.</dd>
          <dt>Limits</dt><dd>Someone on a new phone or in a private window looks like a new person. Your own visits from this browser are not counted (see the switch at the bottom). Days are in UTC; hours are shown in your local time.</dd>
        </dl>
      </details>

      <div className="card">
        <span className="label">Visitors {rid === '24h' ? 'per hour' : 'per day'}</span>
        <Chart
          buckets={s.buckets}
          series={SERIES_VISITORS}
          stacked
          summary={peakDay?.visitors ? <>Busiest {rid === '24h' ? 'hour' : 'day'}: <b>{peakDay.title}</b> with <b>{peakDay.visitors}</b></> : <span>No visitors in this range yet.</span>}
          tipExtra={(b) => <span className="muted">{b.visits} {b.visits === 1 ? 'visit' : 'visits'}</span>}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <span className="label">When people visit · time of day</span>
          <Chart
            buckets={s.byHour}
            series={[{ key: 'visits', label: 'Visits', color: 'var(--orange)' }]}
            highlightMax
            summary={peakHour?.visits ? <>Peak: <b>{peakHour.title}</b></> : <span>No visits yet.</span>}
          />
        </div>
        {rid !== '24h' ? (
          <div className="card">
            <span className="label">Average visits by weekday</span>
            <Chart
              buckets={s.weekdays}
              series={[{ key: 'visits', label: 'Avg visits', color: 'var(--blue)' }]}
              highlightMax
              summary={(() => { const top = s.weekdays.reduce((a, b) => (b.visits > a.visits ? b : a)); return top.visits ? <>Best day: <b>{top.id}</b></> : <span>Not enough data yet.</span>; })()}
            />
          </div>
        ) : (
          <div className="card">
            <span className="label">Cases answered per hour</span>
            <Chart
              buckets={s.buckets}
              series={[{ key: 'answers', label: 'Answers', color: 'var(--blue)' }]}
              summary={<><b>{s.answers}</b> answered in 24 hours</>}
            />
          </div>
        )}
      </div>

      {rid !== '24h' && (
        <div className="grid-2">
          <div className="card">
            <span className="label">Daily case: opened vs answered</span>
            <Chart
              buckets={s.buckets}
              series={[{ key: 'opened', label: 'Opened', color: 'var(--line-2)' }, { key: 'answered', label: 'Answered', color: 'var(--blue)' }]}
              summary={<><b>{dailyOpened}</b> opened · <b>{dailyAnswered}</b> answered{dailyOpened ? <> · <b>{Math.round((dailyAnswered / dailyOpened) * 100)}%</b> finish</> : null}</>}
              tipExtra={(b) => (b.opened ? <span className="muted">{Math.round((b.answered / b.opened) * 100)}% answered</span> : null)}
            />
          </div>
          <div className="card">
            <span className="label">Daily cases</span>
            <div className="table-wrap table-wrap--short">
              <table className="table">
                <thead><tr><th>Date</th><th>Case</th><th>Opened</th><th>Answered</th><th>Strong</th></tr></thead>
                <tbody>
                  {[...daily].reverse().filter(d => d.daily.views).map(d => {
                    const found = d.daily.case && findCase(d.daily.case);
                    return (
                      <tr key={d.day}>
                        <td className="mono nowrap">{fmtDay(d.day)}</td>
                        <td>{found?.caseData.title || d.daily.case}</td>
                        <td>{d.daily.views || 0}</td>
                        <td>{d.daily.answers || 0}</td>
                        <td>{d.daily.answers ? `${Math.round(((d.daily.strong || 0) / d.daily.answers) * 100)}%` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="muted">{DAILY_POOL.length} cases in the daily pool.</p>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <span className="label">Feedback in this range ({feedback.length})</span>
          <div className="feedback-list">
            {feedback.length === 0 && <p className="muted">No feedback in this range.</p>}
            {feedback.map((f, i) => (
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
          <span className="label">Shares · all time</span>
          {Object.keys(data.shares).length === 0 && <p className="muted">No shares yet.</p>}
          {Object.entries(data.shares).map(([k, v]) => <p key={k}><b>{v}</b> <span className="muted">{k}</span></p>)}
        </div>
      </div>

      <h2 className="display admin__section">Tracks · all time</h2>
      {TRACKS.map(t => <Funnel key={t.id} track={t} data={data.tracks[t.id]} />)}

      <div className="card owner">
        <div>
          <b>{owner ? 'Your visits from this browser are not counted.' : 'Your visits from this browser are counted.'}</b>
          <p className="muted">Turn this on in every browser and phone you use, by opening this dashboard there once.</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={toggleOwner}>{owner ? 'Count me again' : 'Stop counting me'}</button>
      </div>
    </main>
  );
}
