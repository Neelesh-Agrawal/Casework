import React, { useState } from 'react';
import { submitChapterFeedback } from '../hooks/useChapterFeedback';

const QUICK_RATINGS = [
  { value: 1, emoji: '😕', label: 'Rough' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😊', label: 'Great' },
  { value: 5, emoji: '🤩', label: 'Loved it' },
];

const FULL_LABELS = ['', 'Needs work', 'Fair', 'Good', 'Great', 'Excellent'];

export default function FeedbackCard({
  variant = 'full',
  scope,
  trackId,
  trackLabel,
  chapterId,
  chapterNum,
  chapterTitle,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [error, setError] = useState('');

  const isQuick = variant === 'quick';
  const isChapter = scope === 'chapter';

  const title = isChapter
    ? `How was Chapter ${chapterNum}?`
    : 'How was this track?';
  const subtitle = isChapter
    ? 'One tap — totally optional.'
    : 'You finished the whole track. We\'d love to hear how it went.';

  const buildPayload = (value, note = '') => ({
    scope,
    trackId,
    trackLabel,
    chapterId: chapterId ?? null,
    chapterNum: chapterNum ?? null,
    chapterTitle: chapterTitle ?? null,
    rating: value,
    comment: note.trim(),
  });

  const runSync = (submission) => {
    setSyncStatus('syncing');
    submission.sync().then((result) => {
      setSyncStatus(result.ok ? 'synced' : 'failed');
    });
  };

  const sendFeedback = (value, note = '') => {
    if (status === 'sent') return;

    setError('');
    setRating(value);
    setStatus('sent');

    const submission = submitChapterFeedback(buildPayload(value, note));
    runSync(submission);
  };

  const handleQuickPick = (value) => {
    if (status === 'sent') return;
    sendFeedback(value);
  };

  const handleFullSubmit = () => {
    if (status === 'sent') return;
    if (!rating) {
      setError('Pick a rating to continue.');
      return;
    }
    sendFeedback(rating, comment);
  };

  if (status === 'sent') {
    const picked = QUICK_RATINGS.find(o => o.value === rating);
    return (
      <div
        className={`feedback-card feedback-card--${variant} feedback-card--done`}
        role="status"
        aria-live="polite"
      >
        <div className="feedback-card__done-row">
          <div className="feedback-card__done-icon" aria-hidden="true">✓</div>
          <p className="feedback-card__done-text">Thanks — this helps us improve Casework.</p>
        </div>
        {isQuick && picked && (
          <p className="feedback-card__done-pick" aria-hidden="true">
            {picked.emoji} {picked.label}
          </p>
        )}
        {syncStatus === 'syncing' && (
          <p className="feedback-card__sync">
            <span className="feedback-card__sync-dot" aria-hidden="true" />
            Saving your feedback…
          </p>
        )}
        {syncStatus === 'synced' && (
          <p className="feedback-card__sync feedback-card__sync--ok">Saved successfully.</p>
        )}
        {syncStatus === 'failed' && (
          <p className="feedback-card__sync feedback-card__sync--fail">
            Couldn&apos;t reach the server — noted on this device.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`feedback-card feedback-card--${variant}`} role="region" aria-label="Feedback">
      <div className="feedback-card__glow" aria-hidden="true" />

      <div className="feedback-card__header">
        <span className="feedback-card__eyebrow">{isChapter ? 'Quick pulse' : 'Track feedback'}</span>
        <h3 className="feedback-card__title">{title}</h3>
        <p className="feedback-card__subtitle">{subtitle}</p>
      </div>

      {isQuick ? (
        <div className="feedback-card__emoji-row" role="group" aria-label="Rate this chapter">
          {QUICK_RATINGS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`feedback-card__emoji ${rating === opt.value ? 'selected' : ''}`}
              onClick={() => handleQuickPick(opt.value)}
              aria-label={`${opt.label} — ${opt.value} out of 5`}
            >
              <span className="feedback-card__emoji-icon" aria-hidden="true">{opt.emoji}</span>
              <span className="feedback-card__emoji-label">{opt.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="feedback-card__stars" role="group" aria-label="Rate this track">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`feedback-card__star ${rating >= star ? 'active' : ''}`}
                onClick={() => { setRating(star); setError(''); }}
                aria-label={`${star} stars — ${FULL_LABELS[star]}`}
                aria-pressed={rating >= star}
              >
                <span className="feedback-card__star-icon" aria-hidden="true">★</span>
                <span className="feedback-card__star-label">{FULL_LABELS[star]}</span>
              </button>
            ))}
          </div>

          <textarea
            className="feedback-card__input"
            placeholder="What stood out? What could be better? (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            aria-label="Track feedback comment"
          />

          <button
            type="button"
            className="btn btn-primary feedback-card__submit"
            onClick={handleFullSubmit}
          >
            Send Feedback
          </button>
        </>
      )}

      {error && <p className="feedback-card__error" role="alert">{error}</p>}
    </div>
  );
}
