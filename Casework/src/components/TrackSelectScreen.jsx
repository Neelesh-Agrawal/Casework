import React from 'react';

const TRACKS = [
  {
    id: 1,
    number: '01',
    title: 'Visual Foundations',
    subtitle: 'See like a designer',
    desc: 'Colour, typography, spacing, and layout — the visual language every designer must own.',
    chapters: 4,
    scenarios: 28,
    color: '#6c63ff',
  },
  {
    id: 2,
    number: '02',
    title: 'UX Thinking',
    subtitle: 'The original track',
    desc: 'Real decisions at a startup. Hick\'s Law, Fitts\'s Law, dark patterns, accessibility. 60+ principles.',
    chapters: 8,
    scenarios: 40,
    color: '#22c55e',
  },
  {
    id: 3,
    number: '03',
    title: 'UI Craft',
    subtitle: 'Build it right',
    desc: 'Component anatomy, missing states, interaction patterns, and what\'s actually wrong with that UI.',
    chapters: 4,
    scenarios: 32,
    color: '#f59e0b',
  },
  {
    id: 4,
    number: '04',
    title: 'Systems Thinking',
    subtitle: 'Scale your design',
    desc: 'Design tokens, atomic design, governance, and learning from real-world systems like Material and Polaris.',
    chapters: 4,
    scenarios: 30,
    color: '#ec4899',
  },
  {
    id: 5,
    number: '05',
    title: 'The Studio',
    subtitle: 'Navigate professional practice',
    desc: 'Clients, handoff, critique, working with devs, and building a design career.',
    chapters: 5,
    scenarios: 40,
    color: '#14b8a6',
  },
];

const TRACK_CHAPTER_IDS = {
  1: [101, 102, 103, 104],
  2: [1, 2, 3, 4, 5, 6, 7, 8],
  3: [301, 302, 303, 304],
  4: [401, 402, 403, 404],
  5: [501, 502, 503, 504, 505],
};

function formatChapterLabel(trackId, chapterId) {
  const ids = TRACK_CHAPTER_IDS[trackId];
  if (!ids) return `Chapter ${chapterId}`;
  const idx = ids.indexOf(chapterId);
  return idx >= 0 ? `Chapter ${idx + 1}` : `Chapter ${chapterId}`;
}

function getCtaLabel(track, save, hasSave, isCompleted) {
  if (hasSave) {
    return `Resume · ${formatChapterLabel(track.id, save.chapter)} →`;
  }
  if (isCompleted) return 'Play Again →';
  return 'Start →';
}

export default function TrackSelectScreen({ onSelectTrack, savedTracks = {} }) {
  return (
    <div className="track-select">
      <div className="splash__bg" aria-hidden="true" />
      <div className="splash__grid" aria-hidden="true" />

      <div className="track-select__header">
        <div className="splash__eyebrow">A Design Learning Game</div>
        <h1 className="splash__title">Casework</h1>
        <p className="track-select__subtitle">Choose your track. Each one teaches a different layer of how designers think.</p>
      </div>

      <div className="track-select__grid" role="list">
        {TRACKS.map(track => {
          const save = savedTracks[track.id];
          const isCompleted = save?.completed || save?.screen === 'FINAL';
          const hasSave = Boolean(save && !isCompleted);

          return (
            <button
              key={track.id}
              className={`track-card ${track.id === 2 ? 'track-card--featured' : ''}`}
              style={{ '--track-color': track.color }}
              onClick={() => onSelectTrack(track.id)}
              role="listitem"
              aria-label={`${track.title} — ${track.desc}`}
            >
              <div className="track-card__accent" aria-hidden="true" />
              <div className="track-card__top">
                <span className="track-card__number">{track.number}</span>
              </div>
              <h2 className="track-card__title">{track.title}</h2>
              <p className="track-card__sub">{track.subtitle}</p>
              <p className="track-card__desc">{track.desc}</p>
              <div className="track-card__meta">
                <span>{track.chapters} chapters</span>
                <span>·</span>
                <span>{track.scenarios} scenarios</span>
              </div>
              {isCompleted && (
                <div className="track-card__save track-card__save--done">✓ Completed</div>
              )}
              <div className="track-card__cta">
                {getCtaLabel(track, save, hasSave, isCompleted)}
              </div>
            </button>
          );
        })}
      </div>

      <p className="track-select__note">Progress is saved separately for each track. Start any track at any time.</p>
    </div>
  );
}
