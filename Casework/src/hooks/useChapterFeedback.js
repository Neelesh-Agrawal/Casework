const STORAGE_KEY = 'casework_chapter_feedback';

export const RATING_LABELS = ['', 'Rough', 'Okay', 'Good', 'Great', 'Loved it'];

export function loadAllFeedback() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function clearAllFeedback() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function exportFeedbackJson() {
  return JSON.stringify(loadAllFeedback(), null, 2);
}

export function saveChapterFeedbackLocally(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const record = { ...entry, savedAt: entry.savedAt || Date.now() };
    existing.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export async function syncFeedbackRemote(payload) {
  const endpoint = (import.meta.env.VITE_FEEDBACK_ENDPOINT || '/api/feedback').trim();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, remote: true };
  } catch {
    return { ok: false, remote: true };
  }
}

/** Saves locally immediately; call `.sync()` to upload in the background. */
export function submitChapterFeedback(entry) {
  const payload = { ...entry, savedAt: Date.now() };
  saveChapterFeedbackLocally(payload);
  return {
    payload,
    sync: () => syncFeedbackRemote(payload),
  };
}
