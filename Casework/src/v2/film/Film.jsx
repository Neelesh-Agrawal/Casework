// The Casework intro film (dev-only page at /film). Everything is driven by one clock so the
// recorder (film/record.mjs) can capture it frame by frame at 1920x1080.
//   ?t=12   start the preview at 12 seconds      ?rec=1   wait for the recorder to start the clock
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { ROOMS, World } from '../scene/rooms';
import { Campus } from '../scene/campus';
import Character from '../ui/Character';
import VO from '../../../film/out/vo.json';
import './film.css';

export const W = 1920;
export const H = 1080;
export const VO_START = [1.5, 5.4, 11.6, 16.4, 21.6, 25.0, 35.3, 42.1, 47.3];
export const DURATION = 53;

const OFFSET = new Vector3(30, 34, 30);
const CHAR_HEIGHT = 2.05;
const params = new URLSearchParams(window.location.search);
const REC = params.get('rec') === '1';
const T0 = Number(params.get('t') || 0);

// ─── time helpers ──────────────────────────────────────────────────────────
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const out = (x) => 1 - Math.pow(1 - x, 3);
const back = (x) => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;
/** visible between a and b, with fade in/out of f seconds */
const win = (t, a, b, f = 0.35) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));

/** time (s) at which a word in a voice line is spoken */
function cue(line, word, nth = 0) {
  const words = VO[line].words;
  let seen = 0;
  for (const w of words) {
    if (w.w.toLowerCase().startsWith(word.toLowerCase())) {
      if (seen === nth) return VO_START[line] + w.t;
      seen += 1;
    }
  }
  return VO_START[line];
}

const CUES = {
  forty: cue(1, 'Forty'), users: cue(1, 'users'), opinion: cue(1, 'opinion'),
  call: cue(5, 'make'), happens: cue(5, 'happens'), principle: cue(5, 'principle'),
  tracks: cue(6, 'tracks'), cases: cue(6, 'cases'), ai: cue(6, 'AI'),
  fresh: cue(7, 'fresh'), habit: cue(7, 'habit'),
};

// ─── the clock ─────────────────────────────────────────────────────────────
const clock = { start: null };
export function filmTime() {
  if (clock.start === null) return T0;
  return T0 + (performance.now() - clock.start) / 1000;
}
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

// ─── camera ────────────────────────────────────────────────────────────────
const MEET = ROOMS['meeting-room'].at;
const KITCHEN = ROOMS.kitchen.at;
const SHOTS = [
  // t, target, zoom
  [0, [-9, 1.1, 13.6], 150],
  [4.8, [0.5, 1.1, 13.6], 150],
  [6.0, [0.5, 1.1, 13.6], 150],
  [10.2, [-3, 1.5, -3], 40],
  [11.4, [-3, 1.5, -3], 40],
  [12.8, [MEET[0] - 0.4, 0.6, MEET[1] - 0.6], 128],
  [23.6, [MEET[0] - 0.1, 0.6, MEET[1] - 0.6], 136],
  [24.6, [MEET[0] - 0.1, 0.6, MEET[1] - 0.6], 136],
  [34.1, [-1, 1.2, -1], 52],
  [35.1, [-4, 2.6, -4], 42],
  [41.1, [-4, 2.6, -4], 40],
  [42.5, [KITCHEN[0] - 0.8, 0.6, KITCHEN[1] - 0.4], 118],
  [46.5, [KITCHEN[0] - 0.6, 0.6, KITCHEN[1] - 0.4], 124],
  [49.5, [-3, 1.5, -3], 34],
  [DURATION, [-3, 1.5, -3], 32],
];

function shotAt(t) {
  let i = 0;
  while (i < SHOTS.length - 2 && t > SHOTS[i + 1][0]) i += 1;
  const [ta, pa, za] = SHOTS[i];
  const [tb, pb, zb] = SHOTS[i + 1];
  const k = ease(seg(t, ta, tb));
  return { target: pa.map((v, j) => lerp(v, pb[j], k)), zoom: lerp(za, zb, k) };
}

function FilmCamera() {
  const { camera } = useThree();
  const look = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const t = filmTime();
    const { target, zoom } = shotAt(t);
    const drift = Math.sin(t * 0.21) * 0.6;
    look.set(target[0], target[1], target[2]);
    camera.position.set(target[0] + OFFSET.x + drift, target[1] + OFFSET.y, target[2] + OFFSET.z - drift);
    camera.lookAt(look);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

// ─── you: a low-poly person walking up to the office ───────────────────────
function You() {
  const ref = useRef();
  const body = useRef();
  useFrame(() => {
    const t = filmTime();
    const k = seg(t, 0, 6.2);
    const x = lerp(-11, 2.6, k);
    if (!ref.current) return;
    ref.current.position.set(x, 0, 13.6);
    ref.current.rotation.y = Math.PI / 2;
    body.current.position.y = k < 1 ? Math.abs(Math.sin(t * 7.5)) * 0.06 : 0;
  });
  return (
    <group ref={ref}>
      <group ref={body}>
        <mesh position={[0.1, 0.38, 0]} castShadow><boxGeometry args={[0.16, 0.76, 0.2]} /><meshStandardMaterial color="#2E3440" flatShading /></mesh>
        <mesh position={[-0.1, 0.38, 0]} castShadow><boxGeometry args={[0.16, 0.76, 0.2]} /><meshStandardMaterial color="#2E3440" flatShading /></mesh>
        <mesh position={[0, 1.12, 0]} castShadow><capsuleGeometry args={[0.24, 0.42, 3, 8]} /><meshStandardMaterial color="#F25F1C" roughness={0.8} flatShading /></mesh>
        <mesh position={[0, 1.66, 0]} castShadow><sphereGeometry args={[0.2, 12, 10]} /><meshStandardMaterial color="#B98060" roughness={0.8} /></mesh>
        <mesh position={[0, 1.76, -0.03]}><sphereGeometry args={[0.21, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#1E1712" roughness={0.9} /></mesh>
        {/* a laptop bag */}
        <mesh position={[0, 1.0, 0.28]} castShadow><boxGeometry args={[0.36, 0.3, 0.08]} /><meshStandardMaterial color="#1F1A14" /></mesh>
      </group>
    </group>
  );
}

// ─── projection of 2D overlay elements onto 3D points ──────────────────────
// Any element with data-anchor="x,y,z" follows that world point. data-char scales it like a person.
function AnchorSync() {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    document.querySelectorAll('[data-anchor]').forEach((el) => {
      const [x, y, z] = el.dataset.anchor.split(',').map(Number);
      v.set(x, y, z).project(camera);
      const sx = ((v.x + 1) / 2) * size.width;
      const sy = ((1 - v.y) / 2) * size.height;
      const scale = el.dataset.char ? (CHAR_HEIGHT * camera.zoom) / 230 : 1;
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%) scale(${scale})`;
    });
  });
  return null;
}

function Scene() {
  return (
    <Canvas
      orthographic
      flat
      shadows
      dpr={1}
      camera={{ position: [30, 34, 30], zoom: 40, near: -100, far: 300 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={() => { if (!REC) setTimeout(startClock, 1200); window.__filmReady = true; }}
    >
      <color attach="background" args={['#CFCAC1']} />
      <hemisphereLight args={['#FFF6E8', '#C9B79C', 1.15]} />
      <directionalLight
        position={[14, 24, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004}
      />
      <World />
      <Campus />
      <You />
      <FilmCamera />
      <AnchorSync />
    </Canvas>
  );
}

// ─── overlay pieces ────────────────────────────────────────────────────────
const slot = (room, i, y = 0) => {
  const r = ROOMS[room];
  return `${r.at[0] + r.slots[i][0]},${y},${r.at[1] + r.slots[i][1]}`;
};

function Actor({ id, room, i, mood, talking, show }) {
  return (
    <div className="f-actor" data-anchor={slot(room, i)} data-char="1" style={{ opacity: show }}>
      <Character id={id} mood={mood} talking={talking} size={120} />
    </div>
  );
}

function Bubble({ room, i, text, show, side = 'center' }) {
  if (show <= 0.01) return null;
  return (
    <div className={`f-bubble-anchor f-bubble-anchor--${side}`} data-anchor={slot(room, i, 2.75)}>
      <div className="f-bubble" style={{ opacity: show, transform: `scale(${lerp(0.85, 1, back(show))})` }}>{text}</div>
    </div>
  );
}

function Captions({ t }) {
  let line = -1;
  VO.forEach((l, i) => { if (t >= VO_START[i] - 0.1 && t <= VO_START[i] + l.dur + 0.5) line = i; });
  if (line < 0 || line === 8) return null;
  const l = VO[line];
  const local = t - VO_START[line];
  const a = win(t, VO_START[line] - 0.1, VO_START[line] + l.dur + 0.5, 0.2);
  return (
    <div className="f-captions" style={{ opacity: a }}>
      <p>
        {l.text.split(' ').map((tok, i, all) => {
          // the spoken words have no punctuation, so match written tokens to them by position
          const w = l.words[Math.min(l.words.length - 1, Math.round((i / all.length) * l.words.length))];
          return <span key={i} className={local >= w.t ? 'on' : ''}>{tok} </span>;
        })}
      </p>
    </div>
  );
}

function Chip({ show, children, style }) {
  return (
    <div className="f-chip" style={{ opacity: show, transform: `translateY(${lerp(16, 0, out(show))}px) scale(${lerp(0.9, 1, back(show))})`, ...style }}>
      {children}
    </div>
  );
}

// The case, as it looks in the app.
const CHOICES = [
  { text: 'Keep signup to email only, then ask company size in onboarding, after a first win.', verdict: 'strong', label: 'Strong call', pct: 61 },
  { text: 'Add all three. Qualified leads are worth a dip in signups. Sales needs that data.', verdict: 'costly', label: 'Costly', pct: 17 },
  { text: 'Add only company size, the one field Sales routes leads on, and drop the rest.', verdict: 'okay', label: 'Defensible', pct: 22 },
];

function CaseDemo({ t }) {
  const a = win(t, 24.0, 34.7, 0.5);
  if (a <= 0) return null;
  const inK = out(seg(t, 24.0, 24.8));
  const picked = t >= CUES.call + 0.25;
  const outcome = seg(t, CUES.happens, CUES.happens + 0.5);
  const principle = seg(t, CUES.principle - 0.2, CUES.principle + 0.4);
  // cursor path: from bottom right to the first option, then click
  const ck = ease(seg(t, CUES.call - 1.1, CUES.call + 0.1));
  const cx = lerp(1500, 560, ck);
  const cy = lerp(980, 572, ck);
  const press = win(t, CUES.call + 0.1, CUES.call + 0.45, 0.1);
  return (
    <div className="f-case-wrap" style={{ opacity: a }}>
      <div className="f-case" style={{ transform: `translateY(${lerp(80, 0, inK)}px)` }}>
        <div className="f-case__left">
          <span className="f-label">UX Thinking · Case 1 of 6</span>
          <h2>Three More Fields</h2>
          <p className="f-situation">Your first week at Launchly. Rhea, the CEO, wants phone, company size and job title added to the signup form, live today. Priya, the researcher, has tested this before.</p>
          <div className="f-notes">
            <div className="f-note" style={{ '--tilt': '-1.2deg' }}><b>38%</b><span>Signup completion today</span></div>
            <div className="f-note f-note--2" style={{ '--tilt': '0.8deg' }}><b>−4 to 7%</b><span>Each added field</span></div>
            <div className="f-note f-note--3" style={{ '--tilt': '-0.4deg' }}><b>12%</b><span>Signups Sales actually calls</span></div>
          </div>
          <h3>It's your first week. What do you propose?</h3>
          <div className="f-choices">
            {CHOICES.map((c, i) => {
              const isPick = i === 0;
              const cls = ['f-choice', picked && `is-${c.verdict}`, picked && isPick && 'is-picked', picked && !isPick && 'is-faded'].filter(Boolean).join(' ');
              return (
                <div key={i} className={cls} style={isPick && press ? { transform: `translateY(${press * 3}px)` } : undefined}>
                  {picked && <i className="f-choice__fill" style={{ width: `${c.pct * seg(t, CUES.call + 0.3, CUES.call + 1.3)}%` }} />}
                  <span className="f-choice__key">{i + 1}</span>
                  <span className="f-choice__text">{picked && isPick && <em>Your pick</em>}{c.text}</span>
                  {picked && <span className={`f-tag f-tag--${c.verdict}`}>{c.label}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="f-case__right">
          <div className="f-outcome" style={{ opacity: outcome, transform: `translateY(${lerp(24, 0, out(outcome))}px)` }}>
            <span className="f-tag f-tag--strong">Strong call</span>
            <span className="f-label">What happened</span>
            <p>Completion held at 38%, and 71% of new users answered the onboarding question right after their first project. Sales got their filter for free.</p>
          </div>
          <div className="f-principle" style={{ opacity: principle, transform: `translateY(${lerp(24, 0, out(principle))}px)` }}>
            <span className="f-label">The principle</span>
            <h4>Interaction cost & progressive profiling</h4>
            <p>Every field before someone sees value is a cost they pay on faith. Ask after their first success and most people answer happily.</p>
          </div>
        </div>
      </div>
      <svg className="f-cursor" style={{ transform: `translate(${cx}px, ${cy}px) scale(${1 - press * 0.15})`, opacity: seg(t, 25.2, 25.6) }} width="44" height="44" viewBox="0 0 24 24">
        <path d="M4 2l15 9.5-6.6 1.3 3.9 7.4-2.9 1.5-3.9-7.4L4 19z" fill="#1F1A14" stroke="#FFFBF4" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const TRACKS = [
  { place: 'meeting-room', title: 'UX Thinking', sub: 'Make the right call', color: '#2F9E6E' },
  { place: 'research-lab', title: 'Designing for AI', sub: 'Design for trust', color: '#7A5AF8' },
  { place: 'design-desk', title: 'Visual Foundations', sub: 'See like a designer', color: '#5B6CF0' },
  { place: 'eng-pod', title: 'UI Craft', sub: 'Build it right', color: '#E08A1E' },
  { place: 'lounge', title: 'Systems Thinking', sub: 'Scale your design', color: '#D6457A' },
];

function TrackPins({ t }) {
  return TRACKS.map((tr, i) => {
    const s = win(t, CUES.tracks + i * 0.45, 42.1, 0.4);
    if (s <= 0) return null;
    const r = ROOMS[tr.place];
    return (
      <div key={tr.place} className="f-pin-anchor" data-anchor={`${r.at[0] + 0.6},3.4,${r.at[1] + 0.6}`}>
        <div className="f-pin" style={{ '--pin': tr.color, opacity: s, transform: `scale(${lerp(0.6, 1, back(s))})` }}>
          <b>{tr.title}</b><span>{tr.sub}</span>
        </div>
      </div>
    );
  });
}

function Counter({ t }) {
  const s = win(t, CUES.tracks - 0.3, 41.9, 0.4);
  if (s <= 0) return null;
  const n = Math.round(226 * ease(seg(t, CUES.cases - 0.8, CUES.cases + 0.8)));
  return (
    <div className="f-counter" style={{ opacity: s, transform: `translateY(${lerp(20, 0, out(s))}px)` }}>
      <div><b>5</b><span>tracks</span></div>
      <div><b>{n}</b><span>real cases</span></div>
      <div className="f-counter__ai" style={{ opacity: seg(t, CUES.ai - 0.2, CUES.ai + 0.3) }}><b>AI</b><span>included</span></div>
    </div>
  );
}

function Daily({ t }) {
  const s = win(t, CUES.fresh - 0.4, 47.1, 0.45);
  if (s <= 0) return null;
  const fill = seg(t, CUES.habit - 0.6, CUES.habit + 1.2);
  return (
    <div className="f-daily" style={{ opacity: s, transform: `translateX(${lerp(60, 0, out(s))}px)` }}>
      <div className="f-daily__stub"><span>Daily case</span><b>#24</b><em>Today</em></div>
      <div className="f-daily__body">
        <h4>Which Label Is Mine</h4>
        <p>Sam Ortiz needs a decision · about a minute</p>
        <div className="f-week">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className={fill * 7 > i ? 'on' : ''}><i />{d}</div>
          ))}
        </div>
        <span className="f-streak">🔥 {Math.max(1, Math.ceil(fill * 7))}-day streak</span>
      </div>
    </div>
  );
}

function EndCard({ t }) {
  const s = seg(t, 46.9, 47.7);
  if (s <= 0) return null;
  const logo = back(seg(t, 47.3, 48.0));
  const word = out(seg(t, 47.5, 48.2));
  const line = out(seg(t, cue(8, 'Sharpen') - 0.1, cue(8, 'Sharpen') + 0.5));
  const sub = out(seg(t, 49.9, 50.5));
  return (
    <div className="f-end" style={{ opacity: s }}>
      <div className="f-end__brand">
        <div className="f-end__mark" style={{ transform: `scale(${logo})` }}>c</div>
        <span style={{ opacity: word, transform: `translateX(${lerp(-20, 0, word)}px)` }}>casework</span>
      </div>
      <h1 style={{ opacity: line, transform: `translateY(${lerp(24, 0, line)}px)` }}>Sharpen your design judgment.</h1>
      <p style={{ opacity: sub, transform: `translateY(${lerp(16, 0, sub)}px)` }}>Real design decisions · 5 tracks · Free, no sign-up</p>
    </div>
  );
}

// ─── the film ──────────────────────────────────────────────────────────────
export default function Film() {
  const t = useFilmTime();
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const onResize = () => setFit(Math.min(window.innerWidth / W, window.innerHeight / H));
    onResize();
    window.addEventListener('resize', onResize);
    window.__filmGo = startClock;
    window.__filmDuration = DURATION;
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const meetShow = win(t, 11.8, 24.6, 0.6);
  const rhea = win(t, 12.6, 16.3, 0.25);
  const priya = win(t, 16.5, 19.0, 0.25);
  const kofi = win(t, cue(3, 'Sales') - 0.1, 21.4, 0.25);
  const kitchenShow = win(t, 42.1, 47.5, 0.5);

  return (
    <div className="film-viewport">
      <div className="film" style={{ transform: `translate(-50%, -50%) scale(${fit})` }}>
        <Scene />
        <div className="f-overlay">
          {/* "You" tag while walking in */}
          <div className="f-you-anchor" data-anchor={`${lerp(-11, 2.6, seg(t, 0, 6.2))},2.5,13.6`}>
            <div className="f-you" style={{ opacity: win(t, 0.6, 6.4, 0.4) }}>You</div>
          </div>

          {/* the meeting */}
          <Actor id="rhea" room="meeting-room" i={0} mood={rhea > 0 ? 'annoyed' : 'neutral'} talking={rhea > 0.5} show={meetShow} />
          <Actor id="kofi" room="meeting-room" i={1} mood={kofi > 0 ? 'thinking' : 'neutral'} talking={kofi > 0.5} show={meetShow} />
          <Actor id="priya" room="meeting-room" i={2} mood={priya > 0 ? 'worried' : 'neutral'} talking={priya > 0.5} show={meetShow} />
          <Bubble room="meeting-room" i={0} show={rhea} text="Add phone, company size and job title to signup. Live today." />
          <Bubble room="meeting-room" i={2} show={priya} text="Every field we've tested cost us 4 to 7% of signups." />
          <Bubble room="meeting-room" i={1} show={kofi} text="My team needs to know who's walking in." />

          {/* the kitchen, daily case */}
          <Actor id="sam" room="kitchen" i={1} mood="excited" talking={kitchenShow > 0.5 && t < 45.9} show={kitchenShow} />

          <TrackPins t={t} />
        </div>

        {/* opening titles */}
        <div className="f-title" style={{ opacity: win(t, 0.4, 5.2, 0.5) }}>
          <span className="f-title__time">Monday · 9:02 AM</span>
          <h1>Day one.</h1>
        </div>

        {/* forty people, eighteen thousand users, endless opinions */}
        <div className="f-stats">
          <Chip show={win(t, CUES.forty, 11.4, 0.3)}><b>40</b> people</Chip>
          <Chip show={win(t, CUES.users - 0.2, 11.4, 0.3)}><b>18,000</b> users</Chip>
          <Chip show={win(t, CUES.opinion - 0.3, 11.4, 0.3)} style={{ background: '#F25F1C', color: '#fff' }}><b>∞</b> opinions</Chip>
        </div>

        {/* what's your call */}
        <div className="f-yourcall" style={{ opacity: win(t, 21.5, 24.3, 0.3) }}>
          <h2 style={{ transform: `scale(${lerp(0.9, 1, back(seg(t, 21.5, 22.1)))})` }}>What's your call?</h2>
        </div>

        <CaseDemo t={t} />
        <Counter t={t} />
        <Daily t={t} />
        <Captions t={t} />
        <EndCard t={t} />
      </div>
    </div>
  );
}
