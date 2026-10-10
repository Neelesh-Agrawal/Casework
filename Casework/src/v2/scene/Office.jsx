// 2.5D office: a three.js isometric office (3D) with illustrated characters and speech bubbles (2D)
// pinned to world positions. The camera glides to whichever room the current scene is in.
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { ROOMS, World } from './rooms';
import { Campus } from './campus';
import Character from '../ui/Character';

const CHAR_HEIGHT = 2.05; // world units — a touch larger than life so faces read on phones
const CHAR_SVG_H = 230;   // Character viewBox height at size=120
const OFFSET = new Vector3(30, 34, 30);
// Aim a little behind the centre so the rooftop billboard and towers fit above the building.
const OVERVIEW_TARGET = new Vector3(-3, 1.5, -3);
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function fitZoom(w, h, overview, frameShift = 0) {
  if (overview) {
    if (frameShift) return Math.min((w * (1 - frameShift * 2)) / (w < 960 ? 38 : 30), h / 29);
    return w < 700 ? Math.min(w / 34, h / 30) : Math.min(w / 32, h / 22);
  }
  return Math.min(w / 11.5, h / 8.2);
}

function roomTarget(place) {
  const room = ROOMS[place];
  if (!room) return new Vector3(0, 0, 0);
  // Aim slightly behind the room centre so the cast (standing at the front) sits low in frame,
  // leaving room above their heads for speech bubbles.
  return new Vector3(room.at[0] - 0.4, 0.4, room.at[1] - 0.9);
}

function CameraRig({ place, overview, frameShift = 0, frameY = 0 }) {
  const { camera, size } = useThree();
  const target = useRef(overview ? OVERVIEW_TARGET.clone() : roomTarget(place));
  const look = useRef(target.current.clone());
  const settled = useRef(false);

  useEffect(() => {
    target.current = overview ? OVERVIEW_TARGET.clone() : roomTarget(place);
  }, [place, overview]);

  useFrame((state, delta) => {
    const k = reduceMotion ? 1 : 1 - Math.exp(-delta * 2.6);
    look.current.lerp(target.current, k);
    const t = state.clock.elapsedTime;
    const drift = reduceMotion ? 0 : (overview ? 1.6 : 0.5);
    const orbit = new Vector3(OFFSET.x + Math.sin(t * 0.15) * drift, OFFSET.y, OFFSET.z + Math.cos(t * 0.15) * drift);
    camera.position.copy(look.current).add(orbit);
    camera.lookAt(look.current);
    const z = fitZoom(size.width, size.height, overview, frameShift);
    camera.zoom = settled.current ? camera.zoom + (z - camera.zoom) * k : z;
    settled.current = true;
    // Shift the picture right (to make room for hero text on the left) without moving the camera.
    if (frameShift || frameY) camera.setViewOffset(size.width, size.height, -frameShift * size.width, frameY * size.height, size.width, size.height);
    else if (camera.view) camera.clearViewOffset();
    camera.updateProjectionMatrix();
  });
  return null;
}

// Writes screen positions for each actor/bubble straight into the DOM every frame (no React re-renders).
function AnchorSync({ place, count, actorEls, bubbleEl, bubbleIndex }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  const head = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const room = ROOMS[place];
    if (!room) return;
    const charPx = CHAR_HEIGHT * camera.zoom;
    const heads = []; // on-screen head boxes, so the bubble can avoid every face

    for (let i = 0; i < count; i += 1) {
      const el = actorEls.current[i];
      const slot = room.slots[i % room.slots.length];
      if (!el || !slot) continue;
      v.set(room.at[0] + slot[0], 0, room.at[1] + slot[1]).project(camera);
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) scale(${charPx / CHAR_SVG_H})`;
      el.style.zIndex = String(Math.round(y));
      head.set(room.at[0] + slot[0], CHAR_HEIGHT * 1.04, room.at[1] + slot[1]).project(camera);
      const hx = ((head.x + 1) / 2) * size.width;
      const hy = ((1 - head.y) / 2) * size.height;
      heads[i] = { hx, hy, box: { x: hx - charPx * 0.2, y: hy, w: charPx * 0.4, h: charPx * 0.42 } };
    }

    const b = bubbleEl.current;
    const me = heads[bubbleIndex];
    if (!b || !me) return;
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const pad = 8;
    const faceY = me.hy + charPx * 0.16; // roughly eye level
    const halfW = charPx * 0.2;
    const fit = (x, y) => [Math.max(pad, Math.min(size.width - bw - pad, x)), Math.max(pad, Math.min(size.height - bh - pad, y))];

    // Candidate spots: above the head, beside the face on the right, then on the left.
    const above = me.hy - 12 - bh;
    const candidates = [
      { side: 'top', pos: fit(me.hx - bw / 2, above) },
      { side: 'right', pos: fit(me.hx + halfW + 14, faceY - bh / 2) },
      { side: 'left', pos: fit(me.hx - halfW - 14 - bw, faceY - bh / 2) },
      { side: 'top', pos: fit(me.hx - 36, above) },        // above, leaning right
      { side: 'top', pos: fit(me.hx - bw + 36, above) },   // above, leaning left
    ];
    const overlap = (r, s) => Math.max(0, Math.min(r.x + r.w, s.x + s.w) - Math.max(r.x, s.x)) * Math.max(0, Math.min(r.y + r.h, s.y + s.h) - Math.max(r.y, s.y));
    let best = candidates[0];
    let bestCost = Infinity;
    candidates.forEach((c, n) => {
      const rect = { x: c.pos[0], y: c.pos[1], w: bw, h: bh };
      // Covering any face (including the speaker's) is the thing to avoid; small bias keeps "top" preferred.
      const cost = heads.reduce((sum, h) => sum + (h ? overlap(rect, h.box) : 0), 0) + Math.min(n, 3) * 40;
      if (cost < bestCost) { bestCost = cost; best = c; }
    });

    const [x, y] = best.pos;
    b.dataset.side = best.side;
    b.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (best.side === 'top') b.style.setProperty('--tail', `${me.hx - (x + bw / 2)}px`);
    else b.style.setProperty('--tail-y', `${Math.max(14, Math.min(bh - 14, faceY - y))}px`);
  });
  return null;
}

// Room pins on the overview: labels that float above each track's room and link to it.
function PinSync({ pins, pinEls }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    pins.forEach((pin, i) => {
      const el = pinEls.current[i];
      const room = ROOMS[pin.place];
      if (!el || !room) return;
      v.set(room.at[0] + 0.6, 3.4, room.at[1] + 0.6).project(camera);
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
      el.style.visibility = 'visible';
    });
  });
  return null;
}

// The phone greeter: a character standing in front of the office, bubble above her head.
const GUIDE_AT = new Vector3(23, 0, 28);
const GUIDE_CLEARANCE = 96; // px reserved for the CTA bar
function GuideSync({ guideEl, bubbleEl }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const el = guideEl.current;
    const b = bubbleEl.current;
    if (!el) return;
    v.copy(GUIDE_AT).project(camera);
    const x = ((v.x + 1) / 2) * size.width;
    // Keep her feet above the button bar at the bottom of the hero, whatever the screen height.
    const y = Math.min(((1 - v.y) / 2) * size.height, size.height - GUIDE_CLEARANCE);
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
    el.style.visibility = 'visible';
    if (b) {
      const bw = b.offsetWidth;
      const bh = b.offsetHeight;
      const left = Math.max(12, Math.min(size.width - bw - 12, x - bw / 2));
      const top = Math.max(12, y - el.offsetHeight - 14 - bh);
      b.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      b.style.setProperty('--tail', `${x - left}px`);
      b.style.visibility = 'visible';
    }
  });
  return null;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * actors: [{ id, mood, talking }]
 * bubble: { index, text } | null — which actor is speaking and what they say
 */
export default function Office({ place, actors = [], bubble = null, overview = false, label = true, pins = [], onPin, frameShift = 0, frameY = 0, guide = null }) {
  const actorEls = useRef([]);
  const pinEls = useRef([]);
  const guideEl = useRef(null);
  const guideBubble = useRef(null);
  const bubbleEl = useRef(null);
  const webgl = useMemo(() => hasWebGL(), []);
  const room = ROOMS[place];

  if (!webgl) {
    return (
      <div className="office office--flat">
        <div className="office__flat-row">
          {actors.map((a, i) => (
            <div key={a.id} className="office__flat-actor">
              {bubble?.index === i && <div className="bubble bubble--static">{bubble.text}</div>}
              <Character id={a.id} mood={a.mood} talking={a.talking} size={110} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="office">
      <Canvas
        orthographic
        flat
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [30, 34, 30], zoom: 40, near: -100, far: 300 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#EDE3D3']} />
        <hemisphereLight args={['#FFF6E8', '#C9B79C', 1.15]} />
        <directionalLight
          position={[14, 24, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-bias={-0.0004}
        />
        <World />
        {overview && <Campus />}
        {overview && pins.length > 0 && <PinSync pins={pins} pinEls={pinEls} />}
        {overview && guide && <GuideSync guideEl={guideEl} bubbleEl={guideBubble} />}
        <CameraRig place={place} overview={overview} frameShift={frameShift} frameY={frameY} />
        {!overview && (
          <AnchorSync
            place={place}
            count={actors.length}
            actorEls={actorEls}
            bubbleEl={bubbleEl}
            bubbleIndex={bubble?.index ?? -1}
          />
        )}
      </Canvas>

      {!overview && (
        <div className="office__overlay" aria-hidden={!bubble}>
          {actors.map((a, i) => (
            <div
              key={`${place}-${a.id}`}
              className={`actor ${bubble?.index === i ? 'actor--speaking' : ''}`}
              ref={el => { actorEls.current[i] = el; }}
            >
              <div className="actor__inner">
                <Character id={a.id} mood={a.mood} talking={a.talking} size={120} />
              </div>
            </div>
          ))}
          {bubble && (
            <div key={`${place}-${bubble.index}-${bubble.text.length}`} className="bubble" ref={bubbleEl} role="status">
              {bubble.text}
            </div>
          )}
        </div>
      )}

      {overview && pins.length > 0 && (
        <div className="office__pins">
          {pins.map((pin, i) => (
            <a
              key={pin.place}
              href={pin.href}
              className="pin"
              style={{ '--pin': pin.color }}
              ref={el => { pinEls.current[i] = el; }}
              onClick={e => onPin?.(e, pin.href)}
            >
              <b>{pin.label}</b>
              {pin.sub && <span>{pin.sub}</span>}
            </a>
          ))}
        </div>
      )}

      {overview && guide && (
        <div className="guide">
          <div className="guide__char" ref={guideEl} aria-hidden="true">
            <Character id={guide.id} mood={guide.mood} talking size={52} />
          </div>
          <button type="button" className="guide__bubble" ref={guideBubble} onClick={guide.onTap} aria-live="polite">
            <span key={guide.line} className="guide__text">{guide.text}</span>
            <span className="guide__dots" aria-hidden="true">{Array.from({ length: guide.lines }, (_, i) => <i key={i} className={i === guide.line ? 'on' : ''} />)}</span>
          </button>
        </div>
      )}

      {label && room && !overview && <span className="office__label">{room.label}</span>}
    </div>
  );
}
