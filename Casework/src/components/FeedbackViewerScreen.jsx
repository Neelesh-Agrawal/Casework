import React, { useState, useMemo, useCallback } from 'react';
import {
  loadAllFeedback,
  clearAllFeedback,
  exportFeedbackJson,
  RATING_LABELS,
} from '../hooks/useChapterFeedback';

const QUICK_EMOJI = ['', '😕', '😐', '🙂', '😊', '🤩'];

function formatWhen(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function downloadJson(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FeedbackViewerScreen({ onBack }) {
  const [entries, setEntries] = useState(() => loadAllFeedback());
  const [filterTrack, setFilterTrack] = useState('all');
  const [filterScope, setFilterScope] = useState('all');

  const refresh = useCallback(() => {
    setEntries(loadAllFeedback());
  }, []);

  const tracks = useMemo(() => {
    const ids = [...new Set(entries.map(e => e.trackId).filter(Boolean))];
    return ids.sort((a, b) => a - b);
  }, [entries]);

  const filtered = useMemo(() => {
    return entries
      .filter(e => filterTrack === 'all' || String(e.trackId) === filterTrack)
      .filter(e => filterScope === 'all' || e.scope === filterScope)
      .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  }, [entries, filterTrack, filterScope]);

  const stats = useMemo(() => {
    const chapter = filtered.filter(e => e.scope === 'chapter');
    const track = filtered.filter(e => e.scope === 'track');
    const avg = (list) => {
      if (!list.length) return null;
      return (list.reduce((s, e) => s + (e.rating || 0), 0) / list.length).toFixed(1);
    };
    return {
      total: filtered.length,
      chapter: chapter.length,
      track: track.length,
      avgChapter: avg(chapter),
      avgTrack: avg(track),
    };
  }, [filtered]);

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadJson(`casework-feedback-${stamp}.json`, exportFeedbackJson());
  };

  const handleClear = () => {
    if (!entries.length) return;
    if (!window.confirm('Delete all feedback stored in this browser? This cannot be undone.')) return;
    clearAllFeedback();
    refresh();
  };

  return (
    <div className="feedback-viewer">
      <div className="splash__bg" aria-hidden="true" />
      <div className="splash__grid" aria-hidden="true" />

      <div className="feedback-viewer__inner">
        <button type="button" className="track-back-btn track-back-btn--splash" onClick={onBack}>
          ← All Tracks
        </button>

        <div className="feedback-viewer__header">
          <div className="splash__eyebrow">Admin</div>
          <h1 className="feedback-viewer__title">Player Feedback</h1>
          <p className="feedback-viewer__desc">
            Ratings and comments from this browser&apos;s local storage.
            Production feedback from all users is collected in your Google Sheet
            (via Vercel → Apps Script). Use the sheet as the source of truth.
          </p>
        </div>

        <div className="feedback-viewer__stats">
          <div className="feedback-viewer__stat">
            <span className="feedback-viewer__stat-num">{stats.total}</span>
            <span className="feedback-viewer__stat-label">Total</span>
          </div>
          <div className="feedback-viewer__stat">
            <span className="feedback-viewer__stat-num">{stats.chapter}</span>
            <span className="feedback-viewer__stat-label">Chapter pulses</span>
          </div>
          <div className="feedback-viewer__stat">
            <span className="feedback-viewer__stat-num">{stats.track}</span>
            <span className="feedback-viewer__stat-label">Track reviews</span>
          </div>
          {stats.avgChapter && (
            <div className="feedback-viewer__stat">
              <span className="feedback-viewer__stat-num">{stats.avgChapter}</span>
              <span className="feedback-viewer__stat-label">Avg chapter</span>
            </div>
          )}
          {stats.avgTrack && (
            <div className="feedback-viewer__stat">
              <span className="feedback-viewer__stat-num">{stats.avgTrack}</span>
              <span className="feedback-viewer__stat-label">Avg track</span>
            </div>
          )}
        </div>

        <div className="feedback-viewer__toolbar">
          <label className="feedback-viewer__filter">
            Track
            <select value={filterTrack} onChange={e => setFilterTrack(e.target.value)}>
              <option value="all">All tracks</option>
              {tracks.map(id => (
                <option key={id} value={String(id)}>Track {id}</option>
              ))}
            </select>
          </label>
          <label className="feedback-viewer__filter">
            Type
            <select value={filterScope} onChange={e => setFilterScope(e.target.value)}>
              <option value="all">All types</option>
              <option value="chapter">Chapter pulse</option>
              <option value="track">Track review</option>
            </select>
          </label>
          <button type="button" className="btn btn-ghost" onClick={refresh}>Refresh</button>
          <button type="button" className="btn btn-ghost" onClick={handleExport} disabled={!entries.length}>
            Export JSON
          </button>
          <button type="button" className="btn btn-ghost feedback-viewer__clear" onClick={handleClear} disabled={!entries.length}>
            Clear all
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="feedback-viewer__empty">
            <div style={{ fontSize: 32 }}>💬</div>
            <p>No feedback yet{entries.length ? ' for this filter' : ''}.</p>
            <p className="feedback-viewer__empty-hint">
              Feedback appears after players rate a chapter or complete a track on this device.
            </p>
          </div>
        ) : (
          <div className="feedback-viewer__list">
            {filtered.map((entry, i) => (
              <article key={`${entry.savedAt}-${i}`} className="feedback-viewer__card">
                <div className="feedback-viewer__card-top">
                  <span className={`feedback-viewer__scope feedback-viewer__scope--${entry.scope}`}>
                    {entry.scope === 'chapter' ? 'Chapter' : 'Track'}
                  </span>
                  <time className="feedback-viewer__time" dateTime={new Date(entry.savedAt).toISOString()}>
                    {formatWhen(entry.savedAt)}
                  </time>
                </div>
                <h3 className="feedback-viewer__card-title">
                  {entry.trackLabel || `Track ${entry.trackId}`}
                  {entry.scope === 'chapter' && entry.chapterNum != null && (
                    <span className="feedback-viewer__chapter">
                      · Ch.{entry.chapterNum}{entry.chapterTitle ? `: ${entry.chapterTitle}` : ''}
                    </span>
                  )}
                </h3>
                <div className="feedback-viewer__rating" aria-label={`Rating ${entry.rating} out of 5`}>
                  <span className="feedback-viewer__rating-emoji" aria-hidden="true">
                    {entry.scope === 'chapter' ? QUICK_EMOJI[entry.rating] : '★'.repeat(entry.rating)}
                  </span>
                  <span className="feedback-viewer__rating-label">
                    {RATING_LABELS[entry.rating] || `${entry.rating}/5`}
                  </span>
                </div>
                {entry.comment?.trim() && (
                  <blockquote className="feedback-viewer__comment">&ldquo;{entry.comment.trim()}&rdquo;</blockquote>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
