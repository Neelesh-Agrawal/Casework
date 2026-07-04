import React from 'react';

export default function TrackBackButton({ onBack, className = '', label = 'All Tracks' }) {
  return (
    <button
      type="button"
      className={`track-back-btn ${className}`.trim()}
      onClick={onBack}
      aria-label="Back to all tracks"
    >
      ← {label}
    </button>
  );
}
