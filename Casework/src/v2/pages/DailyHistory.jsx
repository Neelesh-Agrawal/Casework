// Daily case history, shown two ways: this week as seven day tiles, and a month calendar.
import { useState } from 'react';
import { dateKey } from '../engine/daily';
import { VERDICT } from '../engine/scoring';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MARK = { strong: '✓', okay: '~', costly: '✕' };

function startOfWeek(d) {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
}

function dayState(d, history, todayKey) {
  const k = dateKey(d);
  const e = history[k];
  if (e) return { k, e, state: e.verdict };
  if (k === todayKey) return { k, state: 'today' };
  if (k > todayKey) return { k, state: 'future' };
  return { k, state: 'missed' };
}

function label(d, s) {
  const day = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  if (s.e) return `${day}: ${VERDICT[s.e.verdict].label}, ${s.e.title || ''}`;
  if (s.state === 'today') return `${day}: today, not played yet`;
  if (s.state === 'future') return `${day}: coming up`;
  return `${day}: missed`;
}

/** This week, Monday to Sunday, as seven tiles. */
export function WeekStrip({ history }) {
  const todayKey = dateKey();
  const start = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  return (
    <ol className="week">
      {days.map((d, i) => {
        const s = dayState(d, history, todayKey);
        return (
          <li key={s.k} className={`week__day is-${s.state} ${s.k === todayKey ? 'is-now' : ''}`} title={label(d, s)}>
            <span className="week__name">{DAY_NAMES[i]}</span>
            <span className="week__mark" aria-hidden="true">{s.e ? MARK[s.e.verdict] : d.getDate()}</span>
            <span className="sr-only">{label(d, s)}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** A month calendar you can page back through. */
export function MonthCalendar({ history }) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [offset, setOffset] = useState(0);
  const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1)),
  ];
  const monthEntries = Object.entries(history).filter(([k]) => k.startsWith(dateKey(first).slice(0, 7)));
  const strong = monthEntries.filter(([, e]) => e.verdict === 'strong').length;
  const earliest = Object.keys(history).sort()[0];
  const canBack = earliest && earliest < dateKey(first);

  return (
    <div className="month">
      <div className="month__head">
        <button type="button" className="month__nav" onClick={() => setOffset(o => o - 1)} disabled={!canBack} aria-label="Previous month">‹</button>
        <div>
          <b>{first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</b>
          <span className="muted">{monthEntries.length ? `${monthEntries.length} played · ${strong} strong` : 'No cases played yet'}</span>
        </div>
        <button type="button" className="month__nav" onClick={() => setOffset(o => o + 1)} disabled={offset >= 0} aria-label="Next month">›</button>
      </div>
      <div className="month__grid" role="grid">
        {DAY_NAMES.map(n => <span key={n} className="month__dow">{n.slice(0, 1)}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const s = dayState(d, history, todayKey);
          return (
            <span key={s.k} className={`month__day is-${s.state} ${s.k === todayKey ? 'is-now' : ''}`} title={label(d, s)}>
              {d.getDate()}
            </span>
          );
        })}
      </div>
      <div className="legend">
        <span><i className="dot dot--strong" /> Strong</span>
        <span><i className="dot dot--okay" /> Defensible</span>
        <span><i className="dot dot--costly" /> Costly</span>
        <span><i className="dot dot--none" /> Missed</span>
      </div>
    </div>
  );
}
