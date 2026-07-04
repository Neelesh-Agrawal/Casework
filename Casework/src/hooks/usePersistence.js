import { buildGameSavePayload } from '../lib/resumeState';

const SAVE_KEY = 'designquest_save_v1';

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(buildGameSavePayload(state)));
  } catch {
    void 0;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.chapter || data.score === undefined) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    void 0;
  }
}
