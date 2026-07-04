import React from 'react';
import { DNA_TRAITS, getDNALabel } from '../hooks/useProgression';
import FeedbackCard from './FeedbackCard';

export default function ChapterSummary({
  chapterNum,
  chapterId,
  chapterTitle,
  trackId,
  trackLabel,
  totalScore,
  maxScore,
  chapterScore,
  chapterScenarioCount,
  totalChapters,
  dna,
  onContinue,
}) {
  const pct = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="chapter-summary">
      <div className="chapter-summary__inner">
        <div className="chapter-summary__eyebrow">
          Chapter {chapterNum} of {totalChapters} complete · {chapterScenarioCount} scenarios
        </div>
        <h2 className="chapter-summary__title">{chapterTitle}</h2>

        <div className="chapter-summary__score-row">
          <div className="summary-stat">
            <div className="summary-stat__num">{totalScore}</div>
            <div className="summary-stat__label">Total Rep</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat__num">+{chapterScore}</div>
            <div className="summary-stat__label">This Chapter</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat__num">{pct}%</div>
            <div className="summary-stat__label">Max Score</div>
          </div>
        </div>

        {dna && (
          <div className="summary-dna">
            <div className="summary-dna__label">Your Designer Traits</div>
            <div className="summary-dna__grid">
              {Object.entries(DNA_TRAITS).map(([key, config]) => {
                const val   = dna[key] ?? 50;
                const label = getDNALabel(key, val);
                return (
                  <div key={key} className="dna-card">
                    <div className="dna-card__trait">{config.label}</div>
                    <div className="dna-card__value">{label}</div>
                    <div className="dna-card__bar-wrap">
                      <div className="dna-card__bar" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <FeedbackCard
          variant="quick"
          scope="chapter"
          trackId={trackId}
          trackLabel={trackLabel}
          chapterId={chapterId}
          chapterNum={chapterNum}
          chapterTitle={chapterTitle}
        />

        <button className="btn btn-primary" onClick={onContinue} aria-label={chapterNum < totalChapters ? 'Continue to next chapter' : 'See final results'}>
          {chapterNum < totalChapters ? `Chapter ${chapterNum + 1} →` : 'See Final Results →'}
        </button>
      </div>
    </div>
  );
}
