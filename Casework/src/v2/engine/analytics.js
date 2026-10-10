// Anonymous, batched gameplay events → /api/track. Fire-and-forget; never blocks the game.

const SID_KEY = 'casework.sid';
const queue = [];
let timer = null;
const seen = new Set(); // dedupe "view" events within a session

function sessionId() {
  try {
    let id = localStorage.getItem(SID_KEY);
    if (!id) {
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
  if (once) {
    const k = `${e}:${once}`;
    if (seen.has(k)) return;
    seen.add(k);
  }
  queue.push({ e, ...props });
  if (!timer) timer = setTimeout(flush, 1500);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}
