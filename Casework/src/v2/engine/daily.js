// The Daily Case: one case per calendar day, the same for everyone, numbered from launch.

const EPOCH = Date.UTC(2026, 9, 10); // Case #1: 10 Oct 2026, then a new case every day
const DAY = 86_400_000;

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function previousDateKey(date = new Date()) {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return dateKey(prev);
}

export function dailyNumber(date = new Date()) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(1, Math.floor((local - EPOCH) / DAY) + 1);
}

// Stable shuffle so the daily order doesn't simply walk through the tracks in sequence.
function seededOrder(length, seed) {
  const order = Array.from({ length }, (_, i) => i);
  let s = seed >>> 0;
  for (let i = length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function pickDailyCase(pool, date = new Date()) {
  if (!pool.length) return null;
  const n = dailyNumber(date);
  const order = seededOrder(pool.length, 69);
  return { number: n, entry: pool[order[(n - 1) % pool.length]] };
}
