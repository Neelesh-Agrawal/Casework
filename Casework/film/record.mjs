// Records the /film page frame by frame with a fake clock, so every frame is exact.
//   node film/record.mjs --stills 2,8,14     render a few PNG stills to film/out/stills
//   node film/record.mjs                     render the whole film to film/out/video.mp4 (no audio)
// Needs the dev server running on http://localhost:5173.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('D:/Ship69/Day6/type-or-die-arcade/package.json');
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const args0 = process.argv.slice(2);
const CUT = args0.includes('--cut') ? args0[args0.indexOf('--cut') + 1] : 'intro';
const outDir = path.join(here, CUT === 'intro' ? 'out' : `out-${CUT}`);
const FPS = 30;
const URL = `http://localhost:5173/${CUT === 'intro' ? 'film' : CUT}?rec=1`;
const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;
const ffmpeg = process.env.FFMPEG || fs.readFileSync(path.join(outDir, 'ffmpeg-path.txt'), 'utf8').trim();

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('page error:', e.message));
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('console:', m.text().slice(0, 300)); });
page.on('framenavigated', f => { if (f === page.mainFrame()) console.error('navigated', f.url()); });
await page.clock.install({ time: 0 });
await page.clock.pauseAt(1000); // time only moves when we say so
await page.goto(URL);
// Let lazy chunks, fonts and the WebGL scene come up.
for (let i = 0; i < 200; i += 1) {
  await page.clock.runFor(100);
  const ok = await page.evaluate(() => Boolean(window.__filmReady && window.__filmGo) && document.fonts.status === 'loaded');
  if (ok) break;
}
await page.clock.runFor(500);
const duration = await page.evaluate(() => { window.__filmGo(); return window.__filmDuration; });

// Capture through CDP directly: page.screenshot() waits for web fonts, which can stall forever
// while the page clock is paused.
const cdp = await page.context().newCDPSession(page);
async function frameAt(t, prev) {
  await page.clock.runFor(Math.max(1, Math.round((t - prev) * 1000)));
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
  return Buffer.from(data, 'base64');
}

if (stillsArg) {
  const dir = path.join(outDir, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  let prev = 0;
  for (const t of stillsArg.split(',').map(Number).sort((a, b) => a - b)) {
    const buf = await frameAt(t, prev);
    prev = t;
    fs.writeFileSync(path.join(dir, `t${String(t).padStart(5, '0')}.jpg`), buf);
    console.log('still', t);
  }
} else {
  const total = Math.ceil((args.includes('--to') ? Number(args[args.indexOf('--to') + 1]) : duration) * FPS);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    path.join(outDir, 'video.mp4')], { stdio: ['pipe', 'ignore', 'inherit'] });
  let prev = 0;
  const started = Date.now();
  for (let i = 0; i < total; i += 1) {
    const t = i / FPS;
    const buf = await frameAt(t, prev);
    prev = t;
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) console.log(`frame ${i}/${total}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', path.join(outDir, 'video.mp4'));
}
await browser.close();
