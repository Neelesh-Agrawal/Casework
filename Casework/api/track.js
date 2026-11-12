/**
 * Anonymous gameplay analytics → Upstash. Powers the /admin dashboard (drop-off per case, daily plays, feedback).
 *   POST /api/track { sid, events: [{ e, track?, case?, verdict?, ch?, rating?, comment?, where? }] }
 * No personal data: `sid` is a random id stored in the player's browser.
 *
 * Keys (day = UTC YYYY-MM-DD, HH = UTC hour):
 *   cw:pv:{day}          visits (app opens)            cw:uv:{day}       unique visitors (HyperLogLog)
 *   cw:act:{day}         hash: new, hHH (visits per hour), nHH (new per hour), aHH (answers per hour), answers, starts, completes, shares
 *   cw:uvh:{day}T{HH}    unique visitors in that hour (kept 10 days, for the 24 hour view)
 *   cw:meta:newsince     first day new-vs-returning was recorded
 */
import { configured, ID_RE, pipeline, today } from './_lib/redis.js';

const VERDICTS = new Set(['strong', 'okay', 'costly']);
const SHARE_TARGETS = new Set(['x', 'linkedin', 'copy', 'card', 'native']);
const MAX_EVENTS = 25;
const DAY_TTL = 60 * 60 * 24 * 800; // keep daily keys ~2 years
const HOUR_TTL = 60 * 60 * 24 * 10;

function commandsFor(ev, sid, day, hh) {
  const t = ID_RE.test(ev.track || '') ? ev.track : null;
  const c = ID_RE.test(ev.case || '') ? ev.case : null;
  const act = `cw:act:${day}`;
  const bump = (field) => [['HINCRBY', act, field, 1], ['EXPIRE', act, DAY_TTL]];
  switch (ev.e) {
    case 'visit': {
      const hourKey = `cw:uvh:${day}T${hh}`;
      const out = [
        ['INCR', `cw:pv:${day}`], ['EXPIRE', `cw:pv:${day}`, DAY_TTL],
        ['PFADD', `cw:uv:${day}`, sid], ['EXPIRE', `cw:uv:${day}`, DAY_TTL],
        ['PFADD', hourKey, sid], ['EXPIRE', hourKey, HOUR_TTL],
        ...bump(`h${hh}`),
      ];
      if (ev.new === true) out.push(...bump('new'), ...bump(`n${hh}`), ['SET', 'cw:meta:newsince', day, 'NX']);
      return out;
    }
    case 'track_start':
      return t ? [['HINCRBY', `cw:track:${t}`, 'starts', 1], ['PFADD', `cw:players:${t}`, sid], ...bump('starts')] : [];
    case 'case_view':
      return t && c ? [['HINCRBY', `cw:case:${t}`, `${c}:view`, 1]] : [];
    case 'case_answer':
      return t && c && VERDICTS.has(ev.verdict)
        ? [['HINCRBY', `cw:case:${t}`, `${c}:answer`, 1], ['HINCRBY', `cw:case:${t}`, `${c}:${ev.verdict}`, 1], ...bump('answers'), ...bump(`a${hh}`)]
        : [];
    case 'chapter_done':
      return t && Number.isInteger(ev.ch) ? [['HINCRBY', `cw:track:${t}`, `ch${ev.ch}`, 1]] : [];
    case 'track_done':
      return t ? [['HINCRBY', `cw:track:${t}`, 'completes', 1], ...bump('completes')] : [];
    case 'daily_view':
      return c ? [['HINCRBY', `cw:daily:${day}`, 'views', 1], ['HSET', `cw:daily:${day}`, 'case', c], ['EXPIRE', `cw:daily:${day}`, DAY_TTL]] : [];
    case 'daily_answer':
      return c && VERDICTS.has(ev.verdict)
        ? [['HINCRBY', `cw:daily:${day}`, 'answers', 1], ['HINCRBY', `cw:daily:${day}`, ev.verdict, 1], ...bump('answers'), ...bump(`a${hh}`)]
        : [];
    case 'share':
      return SHARE_TARGETS.has(ev.where) ? [['HINCRBY', 'cw:shares', ev.where, 1], ...bump('shares')] : [];
    case 'feedback': {
      const rating = Number(ev.rating);
      if (!(rating >= 1 && rating <= 5)) return [];
      const entry = JSON.stringify({
        at: Date.now(), track: t, ch: Number.isInteger(ev.ch) ? ev.ch : null, rating,
        comment: String(ev.comment || '').slice(0, 1000),
      });
      return [['LPUSH', 'cw:feedback', entry], ['LTRIM', 'cw:feedback', 0, 999], ['HINCRBY', 'cw:ratings', String(rating), 1]];
    }
    default:
      return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!configured) return res.status(204).end();

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } } // sendBeacon sends text
  const sid = String(body?.sid || '').slice(0, 64);
  const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS) : [];
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(sid) || !events.length) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const day = today();
    const hh = new Date().toISOString().slice(11, 13);
    await pipeline(events.flatMap(ev => commandsFor(ev || {}, sid, day, hh)));
    return res.status(204).end();
  } catch (err) {
    return res.status(502).json({ error: 'Analytics store unavailable', detail: err.message });
  }
}
