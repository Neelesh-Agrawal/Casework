#!/usr/bin/env node
// Validates Casework content against docs/content-guide.md.
// Usage: node scripts/validate-content.mjs [path/to/track.js ...]   (default: every file in src/v2/content/tracks)

import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tracksDir = path.join(root, 'src/v2/content/tracks');

const CAST = ['rhea', 'priya', 'marcus', 'jonas', 'ana', 'kofi', 'lena', 'sam', 'dana'];
const PLACES = ['ceo-office', 'meeting-room', 'design-desk', 'eng-pod', 'kitchen', 'lounge', 'research-lab', 'video-call'];
const MOODS = ['neutral', 'happy', 'worried', 'annoyed', 'thinking', 'excited'];
const KINDS = ['decision', 'spot', 'compose', 'triage'];
const METER_KEYS = ['users', 'business', 'team', 'speed'];

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map(f => path.resolve(f))
  : readdirSync(tracksDir).filter(f => f.endsWith('.js')).map(f => path.join(tracksDir, f));

let errors = 0;
let warnings = 0;
const seenIds = new Map();

function report(level, where, msg) {
  if (level === 'error') errors += 1; else warnings += 1;
  console.log(`  ${level === 'error' ? '✗' : '!'} ${where}: ${msg}`);
}

function len(s) { return typeof s === 'string' ? s.length : 0; }

function checkCase(c, where, track) {
  const err = (m) => report('error', where, m);
  const warn = (m) => report('warn', where, m);

  if (!/^[a-z]+-\d{2,3}$/.test(c.id || '')) err(`id "${c.id}" should look like "ux-07"`);
  if (seenIds.has(c.id)) err(`duplicate id (also in ${seenIds.get(c.id)})`);
  seenIds.set(c.id, track);
  if (!KINDS.includes(c.kind)) err(`unknown kind "${c.kind}"`);
  for (const f of ['title', 'principle', 'place', 'time', 'ask']) if (!c[f]) err(`missing ${f}`);
  if (c.title && /:/.test(c.title)) err('title must not contain a colon');
  if (c.place && !PLACES.includes(c.place)) err(`unknown place "${c.place}"`);
  if (c.time && !/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{2}:\d{2}$/.test(c.time)) err(`time "${c.time}" should look like "Mon 09:40"`);

  if (!Array.isArray(c.cast) || c.cast.length < 1 || c.cast.length > 3) err('cast must list 1–3 people');
  (c.cast || []).forEach(p => { if (!CAST.includes(p)) err(`unknown cast member "${p}"`); });

  if (!Array.isArray(c.scene) || c.scene.length < 2 || c.scene.length > 4) err('scene must have 2–4 beats');
  (c.scene || []).forEach((b, i) => {
    if (!c.cast?.includes(b.who)) err(`scene[${i}].who "${b.who}" is not in cast`);
    if (!MOODS.includes(b.mood)) err(`scene[${i}].mood "${b.mood}" invalid`);
    if (!b.says) err(`scene[${i}] has no line`);
    if (len(b.says) > 200) err(`scene[${i}] line is ${len(b.says)} chars (max 200)`);
  });

  if (!c.situation) err('missing situation');
  else if (len(c.situation) < 120 || len(c.situation) > 460) err(`situation is ${len(c.situation)} chars (aim 150-420, max 460)`);
  if (/[–—]/.test(JSON.stringify(c))) err('contains an em/en dash; use a plain hyphen or rewrite');
  if (!c.takeaway) err('missing takeaway');
  else if (len(c.takeaway) > 140) err(`takeaway is ${len(c.takeaway)} chars (max 140)`);
  if (!c.sayIt) err('missing sayIt');
  else if (len(c.sayIt) > 220) err(`sayIt is ${len(c.sayIt)} chars (max 220)`);

  const d = c.debrief || {};
  for (const f of ['principle', 'insight', 'trap', 'inTheWild']) {
    if (!d[f]) err(`debrief.${f} missing`);
    else if (len(d[f]) > 320) err(`debrief.${f} is ${len(d[f])} chars (max 320)`);
  }

  if (c.kind === 'decision') {
    if (!Array.isArray(c.evidence) || c.evidence.length < 1 || c.evidence.length > 3) err('decision needs 1–3 evidence items');
    (c.evidence || []).forEach((e, i) => { if (!e.label || !e.value) err(`evidence[${i}] needs label and value`); });
    const ch = c.choices || [];
    if (ch.length !== 3) err('decision needs exactly 3 choices');
    const verdicts = ch.map(x => x.verdict).sort().join(',');
    if (verdicts !== 'costly,okay,strong') err(`verdicts must be one each of strong/okay/costly (got ${verdicts})`);
    const lens = ch.map(x => len(x.text));
    const mean = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
    ch.forEach((x, i) => {
      if (len(x.text) < 50 || len(x.text) > 130) err(`choice ${x.id} is ${len(x.text)} chars (aim 60–120)`);
      if (Math.abs(len(x.text) - mean) > mean * 0.15) err(`choice ${x.id} length ${len(x.text)} is more than ±15% from mean ${Math.round(mean)}`);
      if (!x.outcome) err(`choice ${x.id} has no outcome`);
      else if (len(x.outcome) > 260) err(`choice ${x.id} outcome is ${len(x.outcome)} chars (max 260)`);
      if (!x.reaction?.says) err(`choice ${x.id} has no reaction`);
      else {
        if (!c.cast?.includes(x.reaction.who)) err(`choice ${x.id} reaction.who "${x.reaction.who}" not in cast`);
        if (!MOODS.includes(x.reaction.mood)) err(`choice ${x.id} reaction.mood invalid`);
        if (len(x.reaction.says) > 200) err(`choice ${x.id} reaction too long`);
      }
      for (const k of METER_KEYS) {
        const v = x.meters?.[k];
        if (!Number.isInteger(v) || v < -2 || v > 2) err(`choice ${x.id} meters.${k} must be an integer -2..2`);
      }
      if (!['A', 'B', 'C'].includes(x.id) || ch.findIndex(y => y.id === x.id) !== i) err('choice ids must be A, B, C');
    });
  } else if (c.kind === 'spot') {
    if (!c.mock || !c.mockSpec) err('spot needs mock and mockSpec');
    if (!Array.isArray(c.hotspots) || c.hotspots.length < 3 || c.hotspots.length > 5) err('spot needs 3–5 hotspots');
    if (c.taps !== (c.hotspots?.length || 0) + 2) err('taps must equal hotspots + 2');
    (c.hotspots || []).forEach(h => {
      if (!h.id || !h.label || !h.explain) err('each hotspot needs id, label, explain');
      if (c.mockSpec && !c.mockSpec.includes(`[${h.id}]`)) err(`mockSpec doesn't mark hotspot [${h.id}]`);
    });
  } else if (c.kind === 'compose') {
    if (!c.preview || !c.previewSpec) err('compose needs preview and previewSpec');
    (c.slots || []).forEach(s => {
      if (s.options?.length !== 3) err(`slot ${s.id} needs 3 options`);
      if (s.options?.filter(o => o.grade === 'good').length !== 1) err(`slot ${s.id} needs exactly one good option`);
    });
    if (!c.slots?.length) err('compose needs slots');
  } else if (c.kind === 'triage') {
    const tiers = (c.items || []).map(i => i.tier).sort().join(',');
    if (tiers !== 'must,must,nice,nice,should,should') warn(`triage tiers are ${tiers} (expected 2 must, 2 should, 2 nice)`);
    if (!c.pick) err('triage needs pick');
  }
}

for (const file of files) {
  const rel = path.relative(root, file);
  let mod;
  try {
    mod = await import(pathToFileURL(file).href);
  } catch (e) {
    console.log(`\n${rel}\n  ✗ failed to import: ${e.message}`);
    errors += 1;
    continue;
  }
  const track = mod.default;
  console.log(`\n${rel}`);
  if (!track || !Array.isArray(track.chapters)) {
    report('error', rel, 'default export must be a track object with chapters[]');
    continue;
  }
  const isDaily = track.id === 'daily';
  const all = track.chapters.flatMap(ch => {
    if (!isDaily && (!ch.title || !ch.tagline || !ch.intro)) report('error', ch.id, 'chapter needs title, tagline, intro');
    if (ch.intro && len(ch.intro) > 320) report('error', ch.id, `chapter intro ${len(ch.intro)} chars (max 320)`);
    if (!isDaily) {
      for (const kind of ['briefing', 'retro']) {
        const beats = ch[kind];
        if (!Array.isArray(beats) || beats.length < 3 || beats.length > 5) { report('error', ch.id, `${kind} needs 3–5 beats`); continue; }
        if (new Set(beats.map(b => b.who)).size < 2) report('error', ch.id, `${kind} needs at least 2 different speakers`);
        beats.forEach((b, i) => {
          if (!CAST.includes(b.who)) report('error', ch.id, `${kind}[${i}].who "${b.who}" is not a cast member`);
          if (!MOODS.includes(b.mood)) report('error', ch.id, `${kind}[${i}].mood "${b.mood}" invalid`);
          if (!b.says) report('error', ch.id, `${kind}[${i}] has no line`);
          else if (len(b.says) > 160) report('error', ch.id, `${kind}[${i}] is ${len(b.says)} chars (max 160)`);
        });
      }
    }
    return ch.cases || [];
  });
  all.forEach(c => checkCase(c, c.id || '?', rel));

  const decisions = all.filter(c => c.kind === 'decision' && c.choices?.length === 3);
  const strongLongest = decisions.filter(c => {
    const longest = c.choices.reduce((a, b) => (len(b.text) > len(a.text) ? b : a));
    return longest.verdict === 'strong';
  }).length;
  const ratio = decisions.length ? strongLongest / decisions.length : 0;
  if (ratio > 0.35) report('error', rel, `strong choice is the longest in ${Math.round(ratio * 100)}% of decisions (max 35%)`);

  const handsOn = all.filter(c => c.kind !== 'decision').length;
  if (!isDaily && (handsOn < 3 || handsOn > 4)) report('warn', rel, `${handsOn} hands-on cases (aim 3–4)`);

  for (let i = 2; i < all.length; i += 1) {
    if (all[i].place && all[i].place === all[i - 1].place && all[i].place === all[i - 2].place) {
      report('warn', all[i].id, `three cases in a row at "${all[i].place}"`);
    }
  }

  const strongPos = { A: 0, B: 0, C: 0 };
  decisions.forEach(c => { const s = c.choices.find(x => x.verdict === 'strong'); if (s) strongPos[s.id] += 1; });
  console.log(`  ${all.length} cases · ${decisions.length} decisions · ${handsOn} hands-on · strong-is-longest ${Math.round(ratio * 100)}% · strong ids ${JSON.stringify(strongPos)}`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
