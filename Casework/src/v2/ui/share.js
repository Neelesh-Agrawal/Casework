// Share artefacts: a 1200×630 profile card (PNG) and plain-text results for posts.

import { METERS } from '../engine/scoring';

export const siteUrl = () => (typeof window !== 'undefined' ? window.location.origin : 'https://casework.vercel.app');

const VERDICT_EMOJI = { strong: '🟩', okay: '🟨', costly: '🟥' };

export function verdictStrip(verdicts) {
  return verdicts.map(v => VERDICT_EMOJI[v] || '⬜').join('');
}

export function xIntent(text) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function linkedInIntent(url) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const DISPLAY = '"Schibsted Grotesk", system-ui, sans-serif';
const UI = '"Schibsted Grotesk", system-ui, sans-serif';
const MONO = '"Schibsted Grotesk", system-ui, sans-serif';

export async function renderProfileCard({ archetype, trackTitle, rep, verdicts, meters, color }) {
  try {
    await Promise.all([
      document.fonts.load(`700 90px ${DISPLAY}`),
      document.fonts.load(`500 24px ${UI}`),
      document.fonts.load(`500 16px ${MONO}`),
    ]);
  } catch { /* fall back to system fonts */ }

  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // paper background with a soft track-coloured sun
  ctx.fillStyle = '#F3ECE0';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.86, 40, 10, W * 0.86, 40, 520);
  glow.addColorStop(0, `${color}44`);
  glow.addColorStop(1, '#F3ECE000');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // wordmark
  ctx.fillStyle = '#F25F1C';
  roundRect(ctx, 72, 58, 40, 40, 11); ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 30px ${DISPLAY}`;
  ctx.fillText('c', 84, 87);
  ctx.fillStyle = '#1F1A14';
  ctx.font = `700 30px ${DISPLAY}`;
  ctx.fillText('casework', 124, 88);

  ctx.fillStyle = '#8C8172';
  ctx.font = `500 17px ${MONO}`;
  ctx.fillText(`MY DESIGN PROFILE · ${trackTitle.toUpperCase()}`, 72, 170);

  ctx.fillStyle = '#1F1A14';
  ctx.font = `700 92px ${DISPLAY}`;
  ctx.fillText(archetype.name, 66, 268);

  ctx.fillStyle = '#5A5146';
  ctx.font = `500 26px ${UI}`;
  wrap(ctx, archetype.line, 620).slice(0, 3).forEach((l, i) => ctx.fillText(l, 72, 326 + i * 38));

  ctx.font = `400 28px ${UI}`;
  ctx.fillText(verdictStrip(verdicts.slice(0, 20)), 72, 488);

  ctx.fillStyle = '#F25F1C';
  ctx.font = `600 22px ${MONO}`;
  ctx.fillText(`${rep} rep`, 72, 556);
  ctx.fillStyle = '#8C8172';
  ctx.font = `500 18px ${MONO}`;
  ctx.fillText(siteUrl().replace(/^https?:\/\//, ''), 200, 556);

  // meters card
  const px = 790, py = 140, pw = 340, ph = 430;
  ctx.fillStyle = '#FFFBF4';
  roundRect(ctx, px, py, pw, ph, 24); ctx.fill();
  ctx.strokeStyle = '#E2D6C3'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#8C8172';
  ctx.font = `500 15px ${MONO}`;
  ctx.fillText('WHAT I PROTECT', px + 30, py + 50);
  const maxAbs = Math.max(6, ...METERS.map(m => Math.abs(meters[m.key] || 0)));
  METERS.forEach((m, i) => {
    const y = py + 104 + i * 80;
    const v = meters[m.key] || 0;
    ctx.fillStyle = '#1F1A14';
    ctx.font = `700 20px ${UI}`;
    ctx.fillText(m.label, px + 30, y);
    ctx.fillStyle = v >= 0 ? '#23885A' : '#C8372D';
    ctx.textAlign = 'right';
    ctx.font = `600 18px ${MONO}`;
    ctx.fillText(v > 0 ? `+${v}` : String(v), px + pw - 30, y);
    ctx.textAlign = 'left';
    const bx = px + 30, bw = pw - 60, by = y + 16;
    ctx.fillStyle = '#EDE3D3';
    roundRect(ctx, bx, by, bw, 12, 6); ctx.fill();
    const half = bw / 2;
    const len = (Math.abs(v) / maxAbs) * half;
    ctx.fillStyle = v >= 0 ? '#23885A' : '#C8372D';
    if (len > 0) { roundRect(ctx, v >= 0 ? bx + half : bx + half - len, by, Math.max(len, 12), 12, 6); ctx.fill(); }
    ctx.fillStyle = '#D3C4AD';
    ctx.fillRect(bx + half - 1, by - 4, 2, 20);
  });

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

export async function shareOrDownload(blob, filename, text) {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch {
      // User cancelled — fall through to download.
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return 'downloaded';
}
