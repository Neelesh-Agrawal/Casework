/**
 * Vote tallies for "what other designers chose".
 *   GET  /api/votes?ids=ux-01,ux-03  → { configured, votes: { [caseId]: { [choiceId]: count } } }
 *   POST /api/votes { caseId, choiceId } → { ok }
 */
import { configured, ID_RE, pairs, pipeline } from './_lib/redis.js';

const CHOICE_RE = /^[A-Za-z0-9]{1,12}$/;
const key = (caseId) => `casework:votes:${caseId}`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!configured) return res.status(200).json({ configured: false });

  try {
    if (req.method === 'GET') {
      const ids = String(req.query?.ids || '').split(',').filter(id => ID_RE.test(id)).slice(0, 60);
      if (!ids.length) return res.status(400).json({ error: 'No valid ids' });
      const results = await pipeline(ids.map(id => ['HGETALL', key(id)]));
      return res.status(200).json({ configured: true, votes: Object.fromEntries(ids.map((id, i) => [id, pairs(results[i])])) });
    }
    if (req.method === 'POST') {
      const { caseId, choiceId } = req.body || {};
      if (!ID_RE.test(caseId || '') || !CHOICE_RE.test(choiceId || '')) return res.status(400).json({ error: 'Invalid vote' });
      await pipeline([['HINCRBY', key(caseId), choiceId, 1]]);
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(502).json({ error: 'Vote store unavailable', detail: err.message });
  }
}
