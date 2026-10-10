// "Would you ship this?" — the short social cut (dev-only page at /hook).
// A challenge the viewer plays along with in the first 15 seconds, then the product, then the ask.
// Same clock and recorder as the long intro: ?t=12 to preview from 12s, ?rec=1 for the recorder.
import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { ROOMS, World } from '../scene/rooms';
import { Campus } from '../scene/campus';
import Character from '../ui/Character';
import VO from '../../../film/out-hook/vo.json';
import './film.css';
import './hook.css';

const W = 1920;
const H = 1080;
export const VO_START = [0.4, 5.0, 9.3, 15.7, 22.9, 30.4];
export const DURATION = 36.5;
const COUNT_AT = 12.5;       // 3, 2, 1
const REVEAL = 15.6;
const OFFICE = [22.0, 30.6]; // when the 3D office is on screen

const params = new URLSearchParams(window.location.search);
const REC = params.get('rec') === '1';
const T0 = Number(params.get('t') || 0);

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const out = (x) => 1 - Math.pow(1 - x, 3);
const back = (x) => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.3) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));
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

// ─── the 3D office, only mounted for its scene (it is by far the slowest thing to render) ───
const OFFSET = new Vector3(30, 34, 30);
const TRACKS = [
  { place: 'meeting-room', title: 'UX Thinking', color: '#2F9E6E' },
  { place: 'research-lab', title: 'Designing for AI', color: '#7A5AF8' },
  { place: 'design-desk', title: 'Visual Foundations', color: '#5B6CF0' },
  { place: 'eng-pod', title: 'UI Craft', color: '#E08A1E' },
  { place: 'lounge', title: 'Systems Thinking', color: '#D6457A' },
];

function Rig() {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const t = filmTime();
    const k = ease(seg(t, OFFICE[0], OFFICE[1]));
    const target = new Vector3(lerp(-1, -4, k), lerp(1, 2.6, k), lerp(-1, -4, k));
    camera.position.copy(target).add(OFFSET);
    camera.lookAt(target);
    camera.zoom = lerp(70, 40, k);
    camera.updateProjectionMatrix();
    document.querySelectorAll('[data-anchor]').forEach((el) => {
      const [x, y, z] = el.dataset.anchor.split(',').map(Number);
      v.set(x, y, z).project(camera);
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0) translate(-50%, -100%)`;
    });
  });
  return null;
}

function Office({ onReady }) {
  return (
    <Canvas
      orthographic flat shadows dpr={1}
      camera={{ position: [30, 34, 30], zoom: 60, near: -100, far: 300 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={onReady}
    >
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

// ─── 2D pieces ─────────────────────────────────────────────────────────────
const FIELDS = [
  { label: 'Phone number', at: 1.9 },
  { label: 'Company size', at: 2.4 },
  { label: 'Job title', at: 2.9 },
];

function SignupForm({ t }) {
  const drop = seg(t, cue(1, 'costs') - 0.2, cue(1, 'signups') + 0.4);
  const rate = Math.round(lerp(38, 21, ease(drop)));
  return (
    <div className="h-form">
      <div className="h-form__brand"><i>L</i> launchly</div>
      <h3>Create your account</h3>
      <div className="h-field is-filled"><span>Work email</span><b>maya@studio.co</b></div>
      {FIELDS.map((f, i) => {
        const s = seg(t, f.at, f.at + 0.35);
        const chip = pop(t, cue(1, 'costs') + i * 0.25);
        return (
          <div key={f.label} className="h-field is-new" style={{ opacity: s, transform: `translateY(${lerp(-24, 0, out(s))}px)`, maxHeight: `${s * 88}px` }}>
            <span>{f.label}</span>
            <em className="h-cost" style={{ opacity: clamp(chip), transform: `scale(${lerp(0.4, 1, chip)})` }}>−4 to 7%</em>
          </div>
        );
      })}
      <div className="h-cta">Create account</div>
      <div className="h-meter">
        <span>Signups completed</span>
        <b className={drop > 0.05 ? 'is-down' : ''}>{rate}%</b>
        <i><s style={{ width: `${rate}%` }} /></i>
      </div>
    </div>
  );
}

const OPTIONS = [
  { key: 'A', text: 'Ship all three. Sales needs that data.', verdict: 'costly', label: 'Costly' },
  { key: 'B', text: 'Email only now. Ask company size in onboarding.', verdict: 'strong', label: 'Strong call' },
  { key: 'C', text: 'Add just company size, as a compromise.', verdict: 'okay', label: 'Defensible' },
];

function Choice({ t }) {
  const show = win(t, 9.1, OFFICE[0] + 0.3, 0.35);
  if (show <= 0) return null;
  const n = t < COUNT_AT ? null : Math.max(1, 3 - Math.floor(t - COUNT_AT));
  const counting = t >= COUNT_AT && t < REVEAL;
  const ring = counting ? (t - COUNT_AT) / (REVEAL - COUNT_AT) : 0;
  const revealed = t >= REVEAL;
  const resultIn = seg(t, cue(3, 'Same') - 0.2, cue(3, 'Same') + 0.3);
  return (
    <div className="h-choice" style={{ opacity: show }}>
      <div className="h-choice__top">
        <h2 style={{ transform: `scale(${lerp(0.9, 1, pop(t, 9.2))})` }}>{revealed ? 'The strong call' : 'Your call?'}</h2>
        {counting && (
          <div className="h-timer" key={n}>
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="52" className="run" style={{ strokeDashoffset: 327 * ring }} /></svg>
            <b style={{ transform: `scale(${lerp(1.4, 1, out(seg(t % 1, 0, 0.3)))})` }}>{n}</b>
          </div>
        )}
      </div>
      <div className="h-options">
        {OPTIONS.map((o, i) => {
          const s = pop(t, 9.6 + i * 0.25);
          const cls = ['h-option', revealed && `is-${o.verdict}`, revealed && o.verdict !== 'strong' && 'is-dim'].filter(Boolean).join(' ');
          const lift = revealed && o.verdict === 'strong' ? back(seg(t, REVEAL, REVEAL + 0.5)) : 0;
          return (
            <div key={o.key} className={cls} style={{ opacity: clamp(s), transform: `translateY(${lerp(40, 0, clamp(s)) - lift * 16}px) scale(${1 + lift * 0.04})` }}>
              <span className="h-option__key">{o.key}</span>
              <p>{o.text}</p>
              {revealed && <span className={`h-verdict h-verdict--${o.verdict}`}>{o.label}</span>}
            </div>
          );
        })}
      </div>
      <div className="h-result" style={{ opacity: resultIn, transform: `translateY(${lerp(20, 0, out(resultIn))}px)` }}>
        <div><b>38%</b><span>signups kept</span></div>
        <div><b>71%</b><span>answer in onboarding</span></div>
        <div className="h-result__principle"><span>The principle</span><b>Progressive profiling</b></div>
      </div>
      {!revealed && <p className="h-comment" style={{ opacity: seg(t, 10.6, 11.0) }}>Pause. Pick one. Then watch.</p>}
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
    <div className="f-captions h-captions">
      <p>
        {l.text.split(' ').map((tok, i, all) => {
          const w = l.words[Math.min(l.words.length - 1, Math.round((i / all.length) * l.words.length))];
          return <span key={i} className={local >= w.t ? 'on' : ''}>{tok} </span>;
        })}
      </p>
    </div>
  );
}

export default function Hook() {
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

  const intro = win(t, -1, 9.4, 0.35);
  const bubble = pop(t, 0.5);
  const officeOn = t >= OFFICE[0] - 0.6 && t <= OFFICE[1] + 0.2;
  const officeFade = win(t, OFFICE[0], OFFICE[1], 0.4);
  const end = seg(t, OFFICE[1] - 0.2, OFFICE[1] + 0.4);

  return (
    <div className="film-viewport">
      <div className="film h-film" style={{ transform: `translate(-50%, -50%) scale(${fit})` }}>
        {/* scene 1: the ask */}
        <div className="h-scene h-ask" style={{ opacity: intro }}>
          <h1 className="h-hook" style={{ transform: `scale(${lerp(1.06, 1, out(seg(t, 0, 0.6)))})` }}>
            Would you <span>ship this?</span>
          </h1>
          <div className="h-rhea">
            <div className="h-bubble" style={{ opacity: clamp(bubble), transform: `scale(${lerp(0.6, 1, bubble)})` }}>
              Add phone, company size and job title. <b>By lunch.</b>
            </div>
            <Character id="rhea" mood="annoyed" talking={t > 0.4 && t < 4.8} size={210} />
            <span className="h-name">Rhea · CEO</span>
          </div>
          <SignupForm t={t} />
        </div>

        <Choice t={t} />

        {/* scene 3: the product */}
        {officeOn && (
          <div className="h-scene" style={{ opacity: officeFade }}>
            <Office onReady={() => {}} />
            <div className="f-overlay">
              {TRACKS.map((tr, i) => {
                const s = pop(t, cue(4, 'UX') - 1.4 + i * 0.3);
                const r = ROOMS[tr.place];
                return (
                  <div key={tr.place} className="f-pin-anchor" data-anchor={`${r.at[0] + 0.6},3.4,${r.at[1] + 0.6}`}>
                    <div className="f-pin" style={{ '--pin': tr.color, opacity: clamp(s), transform: `scale(${lerp(0.5, 1, s)})` }}><b>{tr.title}</b></div>
                  </div>
                );
              })}
            </div>
            <div className="h-count" style={{ opacity: seg(t, OFFICE[0] + 0.6, OFFICE[0] + 1.0) }}>
              <b>{Math.round(226 * ease(seg(t, cue(4, 'Two') - 0.3, cue(4, 'calls') + 0.2)))}</b>
              <span>real design calls</span>
            </div>
          </div>
        )}

        {/* scene 4: the ask back */}
        {end > 0 && (
          <div className="h-scene h-end" style={{ opacity: end }}>
            <div className="f-end__brand">
              <div className="f-end__mark" style={{ transform: `scale(${pop(t, OFFICE[1])})` }}>c</div>
              <span style={{ opacity: out(seg(t, OFFICE[1] + 0.2, OFFICE[1] + 0.8)) }}>casework</span>
            </div>
            <h1 style={{ opacity: out(seg(t, OFFICE[1] + 0.5, OFFICE[1] + 1.1)) }}>Can you make the right call?</h1>
            <div className="h-end__chips" style={{ opacity: out(seg(t, cue(5, 'free') - 0.1, cue(5, 'free') + 0.4)) }}>
              <span>Free</span><span>No sign-up</span><span>1 minute per case</span>
            </div>
            <p className="h-end__link" style={{ opacity: out(seg(t, cue(5, 'Link') - 0.2, cue(5, 'Link') + 0.3)) }}>Link in the comments ↓</p>
          </div>
        )}

        <Captions t={t} />
      </div>
    </div>
  );
}
