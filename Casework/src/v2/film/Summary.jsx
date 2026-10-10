// The Casework summary film (dev-only page at /summary): what Casework is and what it helps you get
// better at. No quiz, no questions to the viewer. ?t=12 previews from 12s; ?rec=1 waits for the recorder.
import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { ROOMS, World } from '../scene/rooms';
import { Campus } from '../scene/campus';
import Character from '../ui/Character';
import VO from '../../../film/out-summary/vo.json';
import './film.css';
import './hook.css';
import './summary.css';

const W = 1920;
const H = 1080;
export const VO_START = [0.5, 6.2, 10.3, 21.6, 30.0, 35.4];
export const DURATION = 40;
const OFFICE = [5.8, 21.5];

const params = new URLSearchParams(window.location.search);
const REC = params.get('rec') === '1';
const T0 = Number(params.get('t') || 0);

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const out = (x) => 1 - Math.pow(1 - x, 3);
const back = (x) => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.35) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));
const pop = (t, a, d = 0.45) => back(seg(t, a, a + d));

function cue(line, word, nth = 0) {
  let seen = 0;
  for (const w of VO[line].words) {
    if (w.w.toLowerCase().startsWith(word.toLowerCase())) {
      if (seen === nth) return VO_START[line] + w.t;
      seen += 1;
    }
  }
  return VO_START[line];
}

const clock = { start: null };
function filmTime() { return clock.start === null ? T0 : T0 + (performance.now() - clock.start) / 1000; }
function startClock() { if (clock.start === null) clock.start = performance.now(); }
function useFilmTime() {
  const [t, setT] = useState(T0);
  useEffect(() => {
    let raf;
    const loop = () => { setT(filmTime()); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

// ─── 3D office: billboard close-up, then the whole building ────────────────
const OFFSET = new Vector3(30, 34, 30);
const TRACKS = [
  { place: 'meeting-room', title: 'UX Thinking', sub: 'Make the right call', color: '#2F9E6E', word: 'UX' },
  { place: 'design-desk', title: 'Visual Foundations', sub: 'See like a designer', color: '#5B6CF0', word: 'visual' },
  { place: 'eng-pod', title: 'UI Craft', sub: 'Build it right', color: '#E08A1E', word: 'craft' },
  { place: 'lounge', title: 'Systems Thinking', sub: 'Scale your design', color: '#D6457A', word: 'systems' },
  { place: 'research-lab', title: 'Designing for AI', sub: 'Design for trust', color: '#7A5AF8', word: 'AI' },
];

function Rig() {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const t = filmTime();
    const k = ease(seg(t, 9.6, 13.4));
    const drift = Math.sin(t * 0.2) * 0.6;
    target.set(lerp(-13.5, -4, k), lerp(6.2, 2.6, k), lerp(-12.5, -4, k));
    camera.position.set(target.x + OFFSET.x + drift, target.y + OFFSET.y, target.z + OFFSET.z - drift);
    camera.lookAt(target);
    camera.zoom = lerp(72, 41, k) + seg(t, 13.4, OFFICE[1]) * 3;
    camera.updateProjectionMatrix();
    document.querySelectorAll('[data-anchor]').forEach((el) => {
      const [x, y, z] = el.dataset.anchor.split(',').map(Number);
      v.set(x, y, z).project(camera);
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0) translate(-50%, -100%)`;
    });
  });
  return null;
}

function Office() {
  return (
    <Canvas orthographic flat shadows dpr={1} camera={{ position: [30, 34, 30], zoom: 60, near: -100, far: 300 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
      <color attach="background" args={['#CFCAC1']} />
      <hemisphereLight args={['#FFF6E8', '#C9B79C', 1.15]} />
      <directionalLight position={[14, 24, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />
      <World />
      <Campus />
      <Rig />
    </Canvas>
  );
}

// ─── scene 1: everyone wants something different ───────────────────────────
const VOICES = [
  { id: 'rhea', role: 'CEO', mood: 'annoyed', says: 'Ship it today.' },
  { id: 'kofi', role: 'Sales', mood: 'excited', says: 'The client needs one more field.' },
  { id: 'jonas', role: 'Engineering', mood: 'annoyed', says: 'No more pop-ups.' },
  { id: 'ana', role: 'Brand', mood: 'worried', says: 'Make the logo bigger.' },
];

function Crowd({ t }) {
  const show = win(t, -1, 6.4, 0.4);
  if (show <= 0) return null;
  const second = seg(t, cue(0, 'calls') - 0.5, cue(0, 'calls') - 0.1);
  return (
    <div className="s-scene s-crowd" style={{ opacity: show }}>
      <div className="s-head">
        <h1 style={{ opacity: 1 - second, transform: `translateY(${-second * 30}px)` }}>Good design isn't just pixels.</h1>
        <h1 className="s-head__2" style={{ opacity: second, transform: `translateY(${(1 - second) * 30}px)` }}>It's the <span>calls</span> you make.</h1>
      </div>
      <div className="s-people">
        {VOICES.map((p, i) => {
          const s = pop(t, 0.3 + i * 0.18);
          const b = pop(t, 1.3 + i * 0.55);
          return (
            <div key={p.id} className="s-person" style={{ opacity: clamp(s), transform: `translateY(${lerp(60, 0, clamp(s))}px)` }}>
              <div className="s-say" style={{ opacity: clamp(b), transform: `scale(${lerp(0.5, 1, b)}) rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>{p.says}</div>
              <Character id={p.id} mood={p.mood} talking={t > 1.3 + i * 0.55 && t < 2.4 + i * 0.55} size={150} />
              <span className="s-role">{p.role}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── scene 4: how it works ─────────────────────────────────────────────────
const PRINCIPLES = [
  ["Hick's law", 220, 250, -4], ['WCAG contrast', 1450, 210, 3], ['Progressive disclosure', 330, 780, 2], ["Fitts's law", 1560, 760, -3],
  ['Design tokens', 140, 520, 3], ['Automation bias', 1600, 480, -2], ['Gestalt: proximity', 1000, 860, -2], ['Peak-end rule', 640, 170, 2],
  ['Undo over confirmation', 1080, 150, -3], ['Empty states', 560, 880, 3],
];

function Steps({ t }) {
  const show = win(t, 21.3, 30.2, 0.4);
  if (show <= 0) return null;
  const c1 = cue(3, 'decision');
  const c2 = cue(3, 'happened');
  const c3 = cue(3, 'principle');
  const lawsAt = cue(3, 'memorise');
  const whenAt = cue(3, 'when');
  const shift = ease(seg(t, lawsAt - 0.3, lawsAt + 0.5));
  const cards = [
    { at: c1, n: '1', title: 'Make the call', body: <div className="s-mini-opts"><i /><i className="on" /><i /></div> },
    { at: c2, n: '2', title: 'See what happens', body: <div className="s-mini-out"><b>Signups held at 38%</b><span>and Sales still got their data</span></div> },
    { at: c3, n: '3', title: 'Learn the principle', body: <div className="s-mini-prin"><span>The principle</span><b>Progressive profiling</b></div> },
  ];
  return (
    <div className="s-scene s-steps" style={{ opacity: show }}>
      <div className="s-steps__row" style={{ opacity: 1 - shift, transform: `scale(${lerp(1, 0.86, shift)}) translateY(${-shift * 40}px)` }}>
        {cards.map((c, i) => {
          const s = pop(t, c.at - 0.15);
          return (
            <div key={c.n} className="s-step-wrap">
              <div className="s-step" style={{ opacity: clamp(s), transform: `translateY(${lerp(50, 0, clamp(s))}px)` }}>
                <span className="s-step__n">{c.n}</span>
                <h3>{c.title}</h3>
                {c.body}
              </div>
              {i < 2 && <span className="s-arrow" style={{ opacity: seg(t, cards[i + 1].at - 0.3, cards[i + 1].at) }}>→</span>}
            </div>
          );
        })}
      </div>
      {PRINCIPLES.map(([label, x, y, r], i) => {
        const s = pop(t, lawsAt + i * 0.08);
        return (
          <span key={label} className="s-law" style={{ left: x, top: y, opacity: clamp(s) * lerp(1, 0.35, seg(t, whenAt - 0.2, whenAt + 0.4)), transform: `rotate(${r}deg) scale(${lerp(0.4, 1, s)})` }}>{label}</span>
        );
      })}
      <h2 className="s-when" style={{ opacity: seg(t, whenAt - 0.2, whenAt + 0.3), transform: `scale(${lerp(0.9, 1, out(seg(t, whenAt - 0.2, whenAt + 0.4)))})` }}>
        Learn <span>when</span> to use them.
      </h2>
    </div>
  );
}

function Stats({ t }) {
  const show = win(t, 29.8, 35.6, 0.4);
  if (show <= 0) return null;
  const items = [
    { at: cue(4, 'Five'), big: '5', small: 'tracks' },
    { at: cue(4, 'Over'), big: String(Math.round(226 * ease(seg(t, cue(4, 'Over'), cue(4, 'cases') + 0.3)))), small: 'real cases' },
    { at: cue(4, 'new'), big: '1', small: 'new case every day', hot: true },
  ];
  return (
    <div className="s-scene s-stats" style={{ opacity: show }}>
      {items.map((it) => {
        const s = pop(t, it.at - 0.1);
        return (
          <div key={it.small} className={`s-stat ${it.hot ? 'is-hot' : ''}`} style={{ opacity: clamp(s), transform: `translateY(${lerp(50, 0, clamp(s))}px) scale(${lerp(0.8, 1, s)})` }}>
            <b>{it.big}</b><span>{it.small}</span>
          </div>
        );
      })}
    </div>
  );
}

function Captions({ t }) {
  let line = -1;
  VO.forEach((l, i) => { if (t >= VO_START[i] - 0.1 && t <= VO_START[i] + l.dur + 0.4) line = i; });
  if (line < 0 || line === 5) return null;
  const l = VO[line];
  const local = t - VO_START[line];
  return (
    <div className="f-captions s-captions">
      <p>
        {l.text.split(' ').map((tok, i, all) => {
          const w = l.words[Math.min(l.words.length - 1, Math.round((i / all.length) * l.words.length))];
          return <span key={i} className={local >= w.t ? 'on' : ''}>{tok} </span>;
        })}
      </p>
    </div>
  );
}

export default function Summary() {
  const t = useFilmTime();
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const onResize = () => setFit(Math.min(window.innerWidth / W, window.innerHeight / H));
    onResize();
    window.addEventListener('resize', onResize);
    window.__filmGo = startClock;
    window.__filmDuration = DURATION;
    window.__filmReady = true;
    if (!REC) setTimeout(startClock, 1000);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const officeOn = t >= OFFICE[0] - 0.6 && t <= OFFICE[1] + 0.2;
  const officeFade = win(t, OFFICE[0], OFFICE[1], 0.5);
  const intro = win(t, 6.0, 10.1, 0.4);
  const end = seg(t, 35.3, 35.9);

  return (
    <div className="film-viewport">
      <div className="film s-film" style={{ transform: `translate(-50%, -50%) scale(${fit})` }}>
        <Crowd t={t} />

        {officeOn && (
          <div className="s-scene" style={{ opacity: officeFade }}>
            <Office />
            <div className="f-overlay">
              {TRACKS.map((tr) => {
                const s = pop(t, cue(2, tr.word) - 0.1);
                const r = ROOMS[tr.place];
                return (
                  <div key={tr.place} className="f-pin-anchor" data-anchor={`${r.at[0] + 0.6},3.4,${r.at[1] + 0.6}`}>
                    <div className="f-pin" style={{ '--pin': tr.color, opacity: clamp(s), transform: `scale(${lerp(0.5, 1, s)})` }}><b>{tr.title}</b><span>{tr.sub}</span></div>
                  </div>
                );
              })}
            </div>
            <div className="s-intro" style={{ opacity: intro }}>
              <div className="s-intro__card" style={{ transform: `translateY(${lerp(30, 0, out(seg(t, 6.0, 6.7)))}px)` }}>
                <div className="f-end__brand s-brand">
                  <div className="f-end__mark" style={{ transform: `scale(${pop(t, 6.1)})` }}>c</div>
                  <span>casework</span>
                </div>
                <p>A game that trains your <b>design judgment</b>.</p>
              </div>
            </div>
            <div className="s-role-chip" style={{ opacity: win(t, 10.4, 21.2, 0.4) }}>
              You: <b>product designer at Launchly</b>
            </div>
          </div>
        )}

        <Steps t={t} />
        <Stats t={t} />

        {end > 0 && (
          <div className="s-scene h-end s-end" style={{ opacity: end }}>
            <div className="f-end__brand">
              <div className="f-end__mark" style={{ transform: `scale(${pop(t, 35.5)})` }}>c</div>
              <span style={{ opacity: out(seg(t, 35.7, 36.3)) }}>casework</span>
            </div>
            <h1 style={{ opacity: out(seg(t, cue(5, 'Sharpen') - 0.1, cue(5, 'Sharpen') + 0.5)) }}>Sharpen your design judgment.</h1>
            <div className="h-end__chips" style={{ opacity: out(seg(t, 37.6, 38.2)) }}>
              <span>No sign-up</span><span>5 tracks · 226 cases</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
