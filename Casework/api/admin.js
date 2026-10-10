/**
 * Private stats for the /admin dashboard.
 *   GET /api/admin?tracks=ux,ai,…   with header  x-admin-key: <ADMIN_KEY env>
 * Returns raw counters; the dashboard joins them with the content (case order, titles).
 */
import { configured, ID_RE, pairs, pipeline } from './_lib/redis.js';

const DAYS = 30;

function lastDays(n) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i += 1) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return out.reverse();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const expected = process.env.ADMIN_KEY || (process.env.CASEWORK_DEV === '1' ? 'dev' : null);
  if (!expected) return res.status(503).json({ error: 'ADMIN_KEY is not set on the server' });
  if (req.headers['x-admin-key'] !== expected) return res.status(401).json({ error: 'Wrong key' });
  if (!configured) return res.status(200).json({ configured: false });

  const tracks = String(req.query?.tracks || '').split(',').filter(t => ID_RE.test(t)).slice(0, 12);
  const days = lastDays(DAYS);

  try {
    const cmds = [
      ...days.map(d => ['GET', `cw:pv:${d}`]),
      ...days.map(d => ['PFCOUNT', `cw:uv:${d}`]),
      ...days.map(d => ['HGETALL', `cw:daily:${d}`]),
      ...tracks.map(t => ['HGETALL', `cw:track:${t}`]),
      ...tracks.map(t => ['PFCOUNT', `cw:players:${t}`]),
      ...tracks.map(t => ['HGETALL', `cw:case:${t}`]),
      ['LRANGE', 'cw:feedback', 0, 199],
      ['HGETALL', 'cw:ratings'],
      ['HGETALL', 'cw:shares'],
    ];
    const r = await pipeline(cmds);
    let i = 0;
    const take = (n) => r.slice(i, (i += n));
    const pv = take(DAYS);
    const uv = take(DAYS);
    const daily = take(DAYS);
    const trackHashes = take(tracks.length);
    const players = take(tracks.length);
    const caseHashes = take(tracks.length);
    const [feedback, ratings, shares] = take(3);

    return res.status(200).json({
      configured: true,
      days: days.map((d, n) => ({ day: d, views: Number(pv[n]) || 0, visitors: Number(uv[n]) || 0, daily: pairs(daily[n]) })),
      tracks: Object.fromEntries(tracks.map((t, n) => [t, { ...pairs(trackHashes[n]), players: Number(players[n]) || 0, cases: pairs(caseHashes[n]) }])),
      feedback: (feedback || []).map(f => { try { return JSON.parse(f); } catch { return null; } }).filter(Boolean),
      ratings: pairs(ratings),
      shares: pairs(shares),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Store unavailable', detail: err.message });
  }
}
