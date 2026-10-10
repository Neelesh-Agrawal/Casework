// Scoring: verdicts → rep, hands-on grading, meters, and the end-of-track archetype.

export const VERDICT = {
  strong: { label: 'Strong call', rep: 15, tone: 'good' },
  okay:   { label: 'Defensible', rep: 5, tone: 'mid' },
  costly: { label: 'Costly', rep: -10, tone: 'bad' },
};

export const METERS = [
  { key: 'users',    label: 'Users' },
  { key: 'business', label: 'Business' },
  { key: 'team',     label: 'Team' },
  { key: 'speed',    label: 'Speed' },
];

export const EMPTY_METERS = { users: 0, business: 0, team: 0, speed: 0 };

// Hands-on cases have no per-choice meters; these reflect how well the job was done.
const HANDS_ON_METERS = {
  strong: { users: 2, business: 1, team: 1, speed: 0 },
  okay:   { users: 1, business: 0, team: 0, speed: 0 },
  costly: { users: -1, business: -1, team: 0, speed: 0 },
};

export function gradeSpot(caseData, foundIds) {
  const total = caseData.hotspots.length;
  const found = foundIds.length;
  const verdict = found === total ? 'strong' : found >= Math.ceil(total / 2) ? 'okay' : 'costly';
  return { verdict, meters: HANDS_ON_METERS[verdict], voteKey: `f${found}`, found, total };
}

const SLOT_POINTS = { good: 2, meh: 1, bad: 0 };

export function gradeCompose(caseData, picks) {
  const max = caseData.slots.length * 2;
  const points = caseData.slots.reduce((sum, slot) => {
    const option = slot.options[picks[slot.id]];
    return sum + (option ? SLOT_POINTS[option.grade] : 0);
  }, 0);
  const verdict = points === max ? 'strong' : points >= max / 2 ? 'okay' : 'costly';
  return { verdict, meters: HANDS_ON_METERS[verdict], voteKey: verdict, points, max };
}

const TIER_POINTS = { must: 2, should: 1, nice: 0 };

export function gradeTriage(caseData, pickedIds) {
  const best = caseData.items
    .map(i => TIER_POINTS[i.tier])
    .sort((a, b) => b - a)
    .slice(0, caseData.pick)
    .reduce((a, b) => a + b, 0);
  const points = pickedIds.reduce((sum, id) => sum + (TIER_POINTS[caseData.items.find(i => i.id === id)?.tier] || 0), 0);
  const verdict = points >= best ? 'strong' : points >= best - 2 ? 'okay' : 'costly';
  return { verdict, meters: HANDS_ON_METERS[verdict], voteKey: verdict, points, max: best };
}

export function gradeDecision(caseData, choiceId) {
  const choice = caseData.choices.find(c => c.id === choiceId);
  if (!choice) return null;
  return { verdict: choice.verdict, meters: choice.meters, voteKey: choiceId, choice };
}

export function sumMeters(answers) {
  return Object.values(answers).reduce((acc, a) => {
    for (const { key } of METERS) acc[key] += a.meters?.[key] || 0;
    return acc;
  }, { ...EMPTY_METERS });
}

export function sumRep(answers) {
  return Object.values(answers).reduce((sum, a) => sum + (VERDICT[a.verdict]?.rep || 0), 0);
}

export function countVerdicts(answers) {
  return Object.values(answers).reduce((acc, a) => {
    acc[a.verdict] = (acc[a.verdict] || 0) + 1;
    return acc;
  }, { strong: 0, okay: 0, costly: 0 });
}

const ARCHETYPES = {
  users: {
    name: 'The Advocate',
    line: 'You fight for the person on the other side of the screen, even when the room would rather you didn\'t.',
  },
  business: {
    name: 'The Strategist',
    line: 'You tie design to outcomes the company can measure, which is why people keep inviting you to the meeting.',
  },
  team: {
    name: 'The Diplomat',
    line: 'You bring people with you. Your ideas survive because nobody feels steamrolled by them.',
  },
  speed: {
    name: 'The Shipper',
    line: 'You\'d rather learn in production than debate in Figma, and you know which mistakes are cheap.',
  },
  balanced: {
    name: 'The Lead',
    line: 'You weigh users, business, team and time, and rarely let one of them win by default.',
  },
};

export function getArchetype(meters) {
  const entries = METERS.map(({ key }) => [key, meters[key] || 0]);
  const values = entries.map(([, v]) => v);
  const spread = Math.max(...values) - Math.min(...values);
  if (spread <= 3) return { key: 'balanced', ...ARCHETYPES.balanced };
  const [top] = [...entries].sort((a, b) => b[1] - a[1])[0];
  return { key: top, ...ARCHETYPES[top] };
}
