import React from 'react';
import TrackBackButton from './TrackBackButton';

export default function SplashScreen({
  onStart,
  onResume,
  onViewFinalReport,
  canViewFinalReport,
  savedGame,
  chapterCount,
  scenarioCount,
  principleCount,
  maxRep,
  onBackToTracks,
  chapters = [],
  scenarios = [],
}) {
  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const chapterIdx = savedGame
    ? chapters.findIndex(c => c.id === savedGame.chapter)
    : -1;
  const chapterLabel = chapterIdx >= 0 ? chapterIdx + 1 : savedGame?.chapter;

  const progressPct = (() => {
    if (!savedGame) return 0;
    if (savedGame.choices?.length) {
      return Math.min(100, Math.round((savedGame.choices.length / scenarioCount) * 100));
    }
    if (scenarios.length) {
      const completedBefore = scenarios.filter(s => s.chapter < savedGame.chapter).length;
      const position = completedBefore + (savedGame.scenarioIndex || 0);
      return Math.min(100, Math.round((position / scenarioCount) * 100));
    }
    return 0;
  })();

  return (
    <div className="splash">
      <div className="splash__bg" aria-hidden="true" />
      <div className="splash__grid" aria-hidden="true" />

      {onBackToTracks && (
        <TrackBackButton onBack={onBackToTracks} className="track-back-btn--splash" />
      )}

      <div className="splash__eyebrow">A Design Learning Game</div>
      <h1 className="splash__title">Casework</h1>
      <div className="splash__title-sub">Real decisions. Real consequences.</div>
      <p className="splash__tagline">"Every decision shapes the product. And you."</p>

      {savedGame && (
        <div className="resume-card" role="region" aria-label="Saved game found">
          <div className="resume-card__label">↩ SAVED GAME FOUND</div>
          <div className="resume-card__row">
            <div className="resume-card__info">
              <div className="resume-card__chapter">Chapter {chapterLabel} · Scenario {savedGame.scenarioIndex + 1}</div>
              <div className="resume-card__meta">Design Rep: {savedGame.score} · {formatDate(savedGame.savedAt)}</div>
            </div>
          </div>
          <div className="resume-card__bar-wrap">
            <div className="resume-card__bar-label">
              <span>Overall progress</span><span>{progressPct}%</span>
            </div>
            <div className="resume-card__track">
              <div className="resume-card__fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="splash__meta" role="list">
        <div className="splash__meta-item" role="listitem">
          <span className="splash__meta-value">{chapterCount}</span>
          <span className="splash__meta-label">Chapters</span>
        </div>
        <div className="splash__divider" aria-hidden="true" />
        <div className="splash__meta-item" role="listitem">
          <span className="splash__meta-value">{scenarioCount}</span>
          <span className="splash__meta-label">Scenarios</span>
        </div>
        <div className="splash__divider" aria-hidden="true" />
        <div className="splash__meta-item" role="listitem">
          <span className="splash__meta-value">{principleCount}</span>
          <span className="splash__meta-label">Principles</span>
        </div>
        <div className="splash__divider" aria-hidden="true" />
        <div className="splash__meta-item" role="listitem">
          <span className="splash__meta-value">{maxRep}</span>
          <span className="splash__meta-label">Max Rep</span>
        </div>
      </div>

      <p className="splash__ux-note">Built with Nielsen heuristics, WCAG 2.2, and core Laws of UX.</p>

      <div className="splash__cta">
        {savedGame ? (
          <>
            <div className="splash__cta-actions">
              {canViewFinalReport ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onViewFinalReport}
                  aria-label="View final report"
                >
                  View Final Report →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onResume}
                  aria-label="Resume saved game"
                >
                  Resume Game →
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={onStart} aria-label="Start a new game">New Game</button>
            </div>
            <p className="splash__warn">
              {canViewFinalReport
                ? 'Completed run found — open your report or start a new game.'
                : 'New game will overwrite saved progress'}
            </p>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onStart} aria-label="Start Casework">Start Game →</button>
        )}
      </div>
    </div>
  );
}
