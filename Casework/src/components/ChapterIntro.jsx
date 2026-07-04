import React from 'react';

/**
 * ChapterIntro — full-screen chapter opener.
 * Props:
 *   chapter        { id, title, tagline, description }
 *   chapterNumber  1-based sequential number (1, 2, 3, 4...)
 *   totalChapters  total number of chapters
 *   onContinue     callback
 *
 * chapterNumber is passed separately from chapter.id because new tracks
 * use non-sequential IDs (101, 102, 301, 302 etc.) that must not be
 * displayed directly.
 */
export default function ChapterIntro({ chapter, chapterNumber, totalChapters, onContinue }) {
  if (!chapter) return null;

  // Fall back to chapter.id only for the original Track 2 where ids happen
  // to be sequential (1, 2, 3, ...).  All other tracks must pass chapterNumber.
  const num = chapterNumber || chapter.id;

  return (
    <div className="chapter-intro">
      <div className="chapter-intro__bg" aria-hidden="true">
        <div className="chapter-intro__bg-gradient" />
      </div>

      <div className="chapter-intro__content">
        <div className="chapter-intro__number" aria-label={`Chapter ${num} of ${totalChapters}`}>
          Chapter {num} of {totalChapters}
        </div>

        <h1 className="chapter-intro__title">{chapter.title}</h1>

        <p className="chapter-intro__tagline">&ldquo;{chapter.tagline}&rdquo;</p>

        <div className="chapter-intro__line" aria-hidden="true" />

        <p className="chapter-intro__description">{chapter.description}</p>

        <div className="chapter-intro__action">
          <button
            id={`chapter-${num}-continue-btn`}
            type="button"
            className="btn btn-primary"
            onClick={onContinue}
            aria-label={`Begin Chapter ${num}: ${chapter.title}`}
          >
            Begin Chapter {num} →
          </button>
        </div>
      </div>
    </div>
  );
}
