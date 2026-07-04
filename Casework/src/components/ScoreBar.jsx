import React from 'react';

export default function ScoreBar({ score, maxScore, delta, showDelta, onBack }) {
  const clamped  = Math.min(Math.max(score, 0), maxScore);
  const pct      = (clamped / maxScore) * 100;

  let deltaClass = '', deltaText = '';
  if (delta !== null && delta !== undefined) {
    if (delta > 0)      { deltaClass = 'positive'; deltaText = `+${delta}`; }
    else if (delta < 0) { deltaClass = 'negative'; deltaText = `${delta}`; }
    else                { deltaClass = 'neutral';  deltaText = '0'; }
  }

  return (
    <div className="score-bar" role="status" aria-label={`Design Rep: ${clamped} out of ${maxScore}`}>
      {onBack && (
        <button
          type="button"
          className="score-bar__back track-back-btn"
          onClick={onBack}
          aria-label="Back to all tracks"
        >
          ← <span className="score-bar__back-text">Tracks</span>
        </button>
      )}
      <span className="score-bar__label">Design Rep</span>
      <span className="score-bar__value">{clamped} / {maxScore}</span>
      <div className="score-bar__track" aria-hidden="true">
        <div className="score-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {delta !== null && delta !== undefined && (
        <span className={`score-bar__delta ${deltaClass} ${showDelta ? 'visible' : ''}`} aria-hidden="true">
          {deltaText}
        </span>
      )}
    </div>
  );
}
