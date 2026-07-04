// Multi-track persistence — each track has its own localStorage slot.
// Track 2 (v1) re-uses the original key so existing saves survive unchanged.

import { buildGameSavePayload } from '../lib/resumeState';

const SAVE_KEYS = {
  1: 'casework_track1_save',
  2: 'designquest_save_v1', // matches original usePersistence.js SAVE_KEY — preserves existing saves
  3: 'casework_track3_save',
  4: 'casework_track4_save',
  5: 'casework_track5_save',
};

function keyFor(trackId) {
  return SAVE_KEYS[trackId] || `casework_track${trackId}_save`;
}

export function saveTrackGame(trackId, state) {
  try {
    localStorage.setItem(keyFor(trackId), JSON.stringify(buildGameSavePayload(state)));
  } catch { void 0; }
}

export function loadTrackGame(trackId) {
  try {
    const raw = localStorage.getItem(keyFor(trackId));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.chapter || data.score === undefined) return null;
    return data;
  } catch { return null; }
}

export function clearTrackGame(trackId) {
  try { localStorage.removeItem(keyFor(trackId)); } catch { void 0; }
}

// Summary of all saved tracks — used on the track selector screen
export function loadAllTrackSaves() {
  return Object.entries(SAVE_KEYS).reduce((acc, [id, key]) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.chapter && d.score !== undefined) acc[Number(id)] = d;
      }
    } catch { void 0; }
    return acc;
  }, {});
}
