// Tiny Upstash Redis client over the REST pipeline API (no SDK).
// Files under api/_lib are not routes on Vercel.
//
// Env (either naming works):
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN   (Upstash console)
//   KV_REST_API_URL / KV_REST_API_TOKEN                 (Vercel Marketplace integration)
//
// Without credentials: in local dev an in-memory store stands in; in production `configured` is false.

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const dev = process.env.CASEWORK_DEV === '1';

export const configured = Boolean(url && token) || dev;

const mem = globalThis.__caseworkRedis || (globalThis.__caseworkRedis = new Map());

function memRun([cmd, key, ...args]) {
  const op = cmd.toUpperCase();
  const get = (type) => {
    if (!mem.has(key)) mem.set(key, type === 'hash' ? new Map() : type === 'set' ? new Set() : type === 'list' ? [] : 0);
    return mem.get(key);
  };
  switch (op) {
    case 'HINCRBY': { const h = get('hash'); h.set(args[0], (Number(h.get(args[0])) || 0) + Number(args[1])); return h.get(args[0]); }
    case 'HSET': { const h = get('hash'); for (let i = 0; i < args.length; i += 2) h.set(args[i], args[i + 1]); return 1; }
    case 'HGETALL': { const h = mem.get(key); return h ? [...h.entries()].flat().map(String) : []; }
    case 'INCR': { mem.set(key, (Number(mem.get(key)) || 0) + 1); return mem.get(key); }
    case 'GET': { const v = mem.get(key); return v === undefined ? null : String(v); }
    case 'PFADD': { const s = get('set'); args.forEach(a => s.add(a)); return 1; }
    case 'PFCOUNT': { const s = mem.get(key); return s ? s.size : 0; }
    case 'LPUSH': { const l = get('list'); l.unshift(...args.reverse()); return l.length; }
    case 'LTRIM': { const l = get('list'); mem.set(key, l.slice(Number(args[0]), Number(args[1]) + 1)); return 'OK'; }
    case 'LRANGE': { const l = mem.get(key) || []; return l.slice(Number(args[0]), Number(args[1]) === -1 ? undefined : Number(args[1]) + 1); }
    case 'EXPIRE': return 1;
    default: throw new Error(`dev redis: unsupported ${op}`);
  }
}

/** Run several commands; returns their results in order. */
export async function pipeline(commands) {
  if (!commands.length) return [];
  if (url && token) {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    const out = await res.json();
    return out.map(r => (r.error ? null : r.result));
  }
  if (dev) return commands.map(memRun);
  throw new Error('Redis not configured');
}

export function pairs(arr) {
  const out = {};
  for (let i = 0; i < (arr?.length || 0); i += 2) out[arr[i]] = Number.isNaN(Number(arr[i + 1])) ? arr[i + 1] : Number(arr[i + 1]);
  return out;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export const ID_RE = /^[a-z0-9-]{2,40}$/;
