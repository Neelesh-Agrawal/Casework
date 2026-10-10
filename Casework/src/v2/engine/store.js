// Local persistence for progress, the daily streak, and which cases this browser already voted on.
// Everything is wrapped so private windows / blocked storage degrade to an in-memory session.

const KEY = 'casework.v2';

const EMPTY = {
  tracks: {},
  daily: { streak: 0, best: 0, lastDate: null, history: {} },
  voted: {},
};

let memory = null;

function read() {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? { ...EMPTY, ...JSON.parse(raw) } : structuredClone(EMPTY);
  } catch {
    memory = structuredClone(EMPTY);
  }
  return memory;
}

function write(next) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — progress lives for this session only.
  }
  return next;
}

export function loadStore() {
  return read();
}

export function getTrackProgress(trackId) {
  return read().tracks[trackId] || { answers: {}, completedAt: null };
}

export function saveAnswer(trackId, caseId, answer) {
  const store = read();
  const track = store.tracks[trackId] || { answers: {}, completedAt: null };
  return write({
    ...store,
    tracks: {
      ...store.tracks,
      [trackId]: { ...track, answers: { ...track.answers, [caseId]: { ...answer, at: Date.now() } } },
    },
  });
}

export function markTrackComplete(trackId) {
  const store = read();
  const track = store.tracks[trackId] || { answers: {} };
  if (track.completedAt) return store;
  return write({ ...store, tracks: { ...store.tracks, [trackId]: { ...track, completedAt: Date.now() } } });
}

export function markBriefed(trackId, chapterIdx) {
  const store = read();
  const track = store.tracks[trackId] || { answers: {}, completedAt: null };
  const briefed = track.briefed || [];
  if (briefed.includes(chapterIdx)) return store;
  return write({ ...store, tracks: { ...store.tracks, [trackId]: { ...track, briefed: [...briefed, chapterIdx] } } });
}

export function resetTrack(trackId) {
  const store = read();
  const tracks = { ...store.tracks };
  delete tracks[trackId];
  return write({ ...store, tracks });
}

export function hasVoted(caseId) {
  return Boolean(read().voted[caseId]);
}

export function markVoted(caseId) {
  const store = read();
  return write({ ...store, voted: { ...store.voted, [caseId]: true } });
}

export function saveDaily(dateKey, previousDateKey, entry) {
  const store = read();
  const daily = store.daily;
  if (daily.history[dateKey]) return store;
  const continues = daily.lastDate === previousDateKey;
  const streak = continues ? daily.streak + 1 : 1;
  return write({
    ...store,
    daily: {
      streak,
      best: Math.max(daily.best, streak),
      lastDate: dateKey,
      history: { ...daily.history, [dateKey]: entry },
    },
  });
}
