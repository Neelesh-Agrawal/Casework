// Minimal history-API router: real URLs, no dependency.
import { useEffect, useState } from 'react';

const listeners = new Set();

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to);
  window.scrollTo({ top: 0 });
  listeners.forEach(fn => fn());
}

/** The current pathname. Re-renders on any navigation, including query-only changes (?retro=, ?review=). */
export function usePath() {
  const [loc, setLoc] = useState(window.location.pathname + window.location.search);
  const path = loc.split('?')[0];
  useEffect(() => {
    const update = () => setLoc(window.location.pathname + window.location.search);
    listeners.add(update);
    window.addEventListener('popstate', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return path;
}

/** Match "/play/:track" style patterns. Returns params or null. */
export function match(pattern, path) {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i += 1) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

// Internal links that keep the SPA (and still work with cmd/ctrl-click).
export function onLinkClick(e, to) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigate(to);
}
