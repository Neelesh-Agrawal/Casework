// Loads every track file in ./tracks. A track appears in the game as soon as its file exists.
const modules = import.meta.glob('./tracks/*.js', { eager: true });

const ORDER = ['ux', 'ai', 'visual', 'craft', 'systems'];

const loaded = Object.values(modules)
  .map(m => m.default)
  .filter(t => t && Array.isArray(t.chapters));

export const TRACKS = loaded
  .filter(t => t.id !== 'daily')
  .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

export const DAILY = loaded.find(t => t.id === 'daily') || null;

// Shown on the home page as "coming soon" until their file lands.
const PLACEHOLDERS = [
  { id: 'ux', number: '01', title: 'UX Thinking', subtitle: 'The original track', blurb: 'Your first year as Launchly\'s only designer.', color: '#2F9E6E' },
  { id: 'ai', number: '02', title: 'Designing for AI', subtitle: 'New', blurb: 'Launchly ships AI. It\'s fast, confident, and sometimes wrong.', color: '#7A5AF8' },
  { id: 'visual', number: '03', title: 'Visual Foundations', subtitle: 'See like a designer', blurb: 'Colour, type, spacing and hierarchy.', color: '#5B6CF0' },
  { id: 'craft', number: '04', title: 'UI Craft', subtitle: 'Build it right', blurb: 'States, components and patterns.', color: '#E08A1E' },
  { id: 'systems', number: '05', title: 'Systems Thinking', subtitle: 'Scale your design', blurb: 'Tokens, governance and adoption.', color: '#D6457A' },
];

export const ALL_TRACKS = PLACEHOLDERS.map(p => {
  const real = TRACKS.find(t => t.id === p.id);
  return real ? { ...real, released: true } : { ...p, released: false };
});

// Each track lives in its own room of the office.
const TRACK_ROOMS = {
  ux: 'meeting-room',
  ai: 'research-lab',
  visual: 'design-desk',
  craft: 'eng-pod',
  systems: 'lounge',
  daily: 'kitchen',
};

export function roomFor(trackId) {
  return TRACK_ROOMS[trackId] || 'meeting-room';
}

export function getTrack(id) {
  return TRACKS.find(t => t.id === id) || null;
}

export function trackCases(track) {
  return track.chapters.flatMap((ch, chapterIndex) => ch.cases.map(c => ({ ...c, chapterId: ch.id, chapterIndex })));
}

export function findCase(caseId) {
  for (const track of [...TRACKS, ...(DAILY ? [DAILY] : [])]) {
    for (const chapter of track.chapters) {
      const found = chapter.cases.find(c => c.id === caseId);
      if (found) return { track, chapter, caseData: found };
    }
  }
  return null;
}

export const DAILY_POOL = DAILY ? DAILY.chapters.flatMap(ch => ch.cases) : [];
