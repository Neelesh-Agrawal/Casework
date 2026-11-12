// Anonymous, batched gameplay events → /api/track. Fire-and-forget; never blocks the game.

const SID_KEY = 'casework.sid';
export const OWNER_KEY = 'casework.owner'; // set once you open /admin, so your own visits aren't counted
const queue = [];
let timer = null;
const seen = new Set(); // dedupe "view" events within a session

// True when this browser has never been here before (no saved id yet). Read once, before the id is created.
let firstEver = false;

function isOwner() {
  try { return localStorage.getItem(OWNER_KEY) === '1'; } catch { return false; }
}

function sessionId() {
  try {
    let id = localStorage.getItem(SID_KEY);
    if (!id) {
      firstEver = true;
      id = crypto.randomUUID();
      localStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    if (!sessionId.fallback) sessionId.fallback = `tmp-${Math.random().toString(36).slice(2, 14)}`;
    return sessionId.fallback;
  }
}

function flush() {
  timer = null;
  if (!queue.length) return;
  const body = JSON.stringify({ sid: sessionId(), events: queue.splice(0, 25) });
  try {
    const sent = navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }));
    if (!sent) fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
  } catch {
    // Analytics must never break the game.
  }
  if (queue.length) flush();
}

export function track(e, props = {}, { once } = {}) {
  if (isOwner() || (typeof location !== 'undefined' && location.pathname.startsWith('/admin'))) return;
  if (once) {
    const k = `${e}:${once}`;
    if (seen.has(k)) return;
    seen.add(k);
  }
  if (e === 'visit') {
    sessionId(); // creates the id on a first-ever visit, which sets firstEver
    if (firstEver) props = { ...props, new: true };
  }
  queue.push({ e, ...props });
  if (!timer) timer = setTimeout(flush, 1500);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}
