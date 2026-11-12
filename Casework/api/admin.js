/**
 * Private stats for the /admin dashboard.
 *   GET /api/admin?tracks=ux,ai,…&from=YYYY-MM-DD&to=YYYY-MM-DD[&compare=0][&hours=1]
 *   header  x-admin-key: <ADMIN_KEY env>
 *
 * Returns raw counters for every day in the range (plus the same-length period before it, for comparisons),
 * unique visitors across the whole range (merged, so someone who came on 3 days counts once), and,
 * with hours=1, the last 48 hours bucketed by hour. The dashboard does the maths and joins in case titles.
 * Days and hours are UTC; the dashboard shows hours in the viewer's local time.
 */
import { configured, ID_RE, pairs, pipeline, today } from './_lib/redis.js';

const DAY_MS = 86400000;
const MAX_DAYS = 400;
const KEEP = 60 * 60 * 24 * 800; // opening the dashboard refreshes the expiry of the days it shows
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const ms = (day) => Date.parse(`${day}T00:00:00Z`);

function dayList(from, to) {
  const out = [];
  for (let t = ms(from); t <= ms(to); t += DAY_MS) out.push(iso(t));
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const expected = process.env.ADMIN_KEY || (process.env.CASEWORK_DEV === '1' ? 'dev' : null);
  if (!expected) return res.status(503).json({ error: 'ADMIN_KEY is not set on the server' });
  if (req.headers['x-admin-key'] !== expected) return res.status(401).json({ error: 'Wrong key' });
  if (!configured) return res.status(200).json({ configured: false });

  const q = req.query || {};
  const tracks = String(q.tracks || '').split(',').filter(t => ID_RE.test(t)).slice(0, 12);
  const now = today();
  let to = DATE_RE.test(q.to || '') ? q.to : now;
  if (to > now) to = now;
  let from = DATE_RE.test(q.from || '') ? q.from : iso(ms(to) - 29 * DAY_MS);
  if (from > to) from = to;
  if ((ms(to) - ms(from)) / DAY_MS >= MAX_DAYS) from = iso(ms(to) - (MAX_DAYS - 1) * DAY_MS);
  const cur = dayList(from, to);
  const compare = q.compare !== '0';
  const prev = compare ? dayList(iso(ms(from) - cur.length * DAY_MS), iso(ms(from) - DAY_MS)) : [];
  const all = [...prev, ...cur];

  // Last 48 UTC hours, oldest first, as "YYYY-MM-DDTHH".
  const hourKeys = [];
  if (q.hours === '1') {
    const top = Math.floor(Date.now() / 3600000) * 3600000;
    for (let i = 47; i >= 0; i -= 1) hourKeys.push(new Date(top - i * 3600000).toISOString().slice(0, 13));
  }

  try {
    // New-vs-returning only exists from the day it started being recorded; count unique visitors over that part too.
    const [newSince] = await pipeline([['GET', 'cw:meta:newsince']]);
    const tracked = newSince ? cur.filter(d => d >= newSince) : [];
    const cmds = [
      tracked.length ? ['PFCOUNT', ...tracked.map(d => `cw:uv:${d}`)] : ['GET', 'cw:none'],
      ...all.map(d => ['GET', `cw:pv:${d}`]),
      ...all.map(d => ['PFCOUNT', `cw:uv:${d}`]),
      ...all.map(d => ['HGETALL', `cw:daily:${d}`]),
      ...all.map(d => ['HGETALL', `cw:act:${d}`]),
      ['PFCOUNT', ...cur.map(d => `cw:uv:${d}`)],
      prev.length ? ['PFCOUNT', ...prev.map(d => `cw:uv:${d}`)] : ['GET', 'cw:none'],
      ...hourKeys.map(h => ['PFCOUNT', `cw:uvh:${h}`]),
      hourKeys.length ? ['PFCOUNT', ...hourKeys.slice(24).map(h => `cw:uvh:${h}`)] : ['GET', 'cw:none'],
      hourKeys.length ? ['PFCOUNT', ...hourKeys.slice(0, 24).map(h => `cw:uvh:${h}`)] : ['GET', 'cw:none'],
      ...tracks.map(t => ['HGETALL', `cw:track:${t}`]),
      ...tracks.map(t => ['PFCOUNT', `cw:players:${t}`]),
      ...tracks.map(t => ['HGETALL', `cw:case:${t}`]),
      ['LRANGE', 'cw:feedback', 0, 999],
      ['HGETALL', 'cw:ratings'],
      ['HGETALL', 'cw:shares'],
      // Older days were written with a ~4 month expiry; keep anything we look at for ~2 years.
      ...cur.flatMap(d => [['EXPIRE', `cw:pv:${d}`, KEEP], ['EXPIRE', `cw:uv:${d}`, KEEP], ['EXPIRE', `cw:daily:${d}`, KEEP]]),
    ];
    const r = await pipeline(cmds);
    let i = 0;
    const take = (n) => r.slice(i, (i += n));
    const [uniqueTracked] = take(1);
    const pv = take(all.length);
    const uv = take(all.length);
    const daily = take(all.length);
    const act = take(all.length);
    const [uniqueCur, uniquePrev] = take(2);
    const hourUv = take(hourKeys.length);
    const [unique24, uniquePrev24] = take(2);
    const trackHashes = take(tracks.length);
    const players = take(tracks.length);
    const caseHashes = take(tracks.length);
    const [feedback, ratings, shares] = take(3);

    return res.status(200).json({
      configured: true,
      range: { from, to, prevFrom: prev[0] || null, prevTo: prev[prev.length - 1] || null },
      days: all.map((d, n) => ({
        day: d, prev: n < prev.length,
        visits: Number(pv[n]) || 0, visitors: Number(uv[n]) || 0, act: pairs(act[n]), daily: pairs(daily[n]),
      })),
      unique: { cur: Number(uniqueCur) || 0, prev: prev.length ? Number(uniquePrev) || 0 : null, tracked: Number(uniqueTracked) || 0, trackedFrom: tracked[0] || null },
      hours: hourKeys.map((h, n) => ({ hour: h, visitors: Number(hourUv[n]) || 0 })),
      unique24: hourKeys.length ? { cur: Number(unique24) || 0, prev: Number(uniquePrev24) || 0 } : null,
      newSince: newSince || null,
      tracks: Object.fromEntries(tracks.map((t, n) => [t, { ...pairs(trackHashes[n]), players: Number(players[n]) || 0, cases: pairs(caseHashes[n]) }])),
      feedback: (feedback || []).map(f => { try { return JSON.parse(f); } catch { return null; } }).filter(Boolean),
      ratings: pairs(ratings),
      shares: pairs(shares),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Store unavailable', detail: err.message });
  }
}
