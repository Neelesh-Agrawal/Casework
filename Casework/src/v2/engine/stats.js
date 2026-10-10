// Client for /api/votes — the "what other designers chose" numbers.
// If the backend isn't configured, everything resolves to null and the UI simply hides the stats.

import { hasVoted, markVoted } from './store';

// Below this, percentages are noise — show nothing rather than "100% of 1 designer".
export const MIN_VOTES_TO_SHOW = 10;

export async function fetchVotes(caseId) {
  try {
    const res = await fetch(`/api/votes?ids=${encodeURIComponent(caseId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.configured) return null;
    return data.votes?.[caseId] || {};
  } catch {
    return null;
  }
}

// Records the vote once per browser, then returns fresh totals (including this vote).
export async function castVote(caseId, voteKey) {
  if (!hasVoted(caseId)) {
    markVoted(caseId); // mark first, so overlapping calls can never double-count
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, choiceId: voteKey }),
      });
    } catch {
      // Offline or backend down — the game carries on without stats.
    }
  }
  return fetchVotes(caseId);
}

export function totalVotes(votes) {
  return votes ? Object.values(votes).reduce((a, b) => a + b, 0) : 0;
}
