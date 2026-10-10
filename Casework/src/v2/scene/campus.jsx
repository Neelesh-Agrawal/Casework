// The street around the office for the home page: a city block with roads, parked cars, office
// towers behind, and a big Launchly billboard on the roof. People walk between rooms. All primitives.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { Box } from './props';

const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const FONT = '"Schibsted Grotesk", system-ui, sans-serif';

function makeTexture(draw, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** A rooftop hoarding: steel frame, lit board, catwalk and lamps. */
function Billboard({ position, rotation }) {
  const tex = useMemo(() => makeTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#FF6B2C'); g.addColorStop(1, '#E14F12');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FFFBF4';
    ctx.beginPath(); ctx.roundRect(90, 110, 300, 300, 72); ctx.fill();
    ctx.fillStyle = '#E14F12';
    ctx.font = `800 260px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillText('L', 240, 272);
    ctx.textAlign = 'left'; ctx.fillStyle = '#FFFBF4';
    ctx.font = `800 250px ${FONT}`;
    ctx.fillText('Launchly', 450, 236);
    ctx.font = `600 64px ${FONT}`; ctx.fillStyle = 'rgba(255,251,244,0.88)';
    ctx.fillText('Project tools for remote teams', 460, 410);
  }, 1600, 520), []);
  const W = 12; const H = 3.9; const LIFT = 4.2;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-4.5, 0, 4.5].map(x => (
        <group key={x}>
          <Box size={[0.22, LIFT, 0.22]} position={[x, LIFT / 2, -0.4]} color="#3A3F46" />
          <Box size={[0.12, LIFT * 1.05, 0.12]} position={[x, LIFT / 2, 0.5]} color="#3A3F46" rotation={[0.22, 0, 0]} />
        </group>
      ))}
      <Box size={[W + 0.6, 0.12, 1.2]} position={[0, LIFT - 0.1, 0.4]} color="#5A6068" />
      <Box size={[W + 0.4, H + 0.4, 0.3]} position={[0, LIFT + H / 2, -0.2]} color="#2B2F35" />
      <mesh position={[0, LIFT + H / 2, -0.04]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {[-4, 0, 4].map(x => (
        <group key={`l${x}`} position={[x, LIFT + H + 0.35, 0.5]}>
          <Box size={[0.08, 0.5, 0.08]} position={[0, -0.1, -0.3]} color="#3A3F46" castShadow={false} />
          <Box size={[0.7, 0.14, 0.3]} position={[0, 0.1, 0]} color="#2B2F35" castShadow={false} />
        </group>
      ))}
    </group>
  );
}

function windowTexture(tint, repX, repY) {
  const tex = makeTexture((ctx, w, h) => {
    ctx.fillStyle = tint; ctx.fillRect(0, 0, w, h);
    for (let y = 8; y < h; y += 32) {
      for (let x = 8; x < w; x += 24) {
        const lit = (x * 7 + y * 3) % 5 === 0;
        ctx.fillStyle = lit ? '#FFE9B8' : 'rgba(205,224,242,0.85)';
        ctx.fillRect(x, y, 16, 20);
      }
    }
  }, 128, 256);
  tex.wrapS = RepeatWrapping; tex.wrapT = RepeatWrapping;
  tex.repeat.set(repX, repY);
  return tex;
}

function Tower({ position, size, tint = '#8C96A3' }) {
  const [w, h, d] = size;
  const front = useMemo(() => windowTexture(tint, w / 4, h / 8), [tint, w, h]);
  const side = useMemo(() => windowTexture(tint, d / 4, h / 8), [tint, d, h]);
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        {/* faces: +x, -x, +y, -y, +z, -z */}
        <meshStandardMaterial attach="material-0" map={side} roughness={0.5} />
        <meshStandardMaterial attach="material-1" color={tint} />
        <meshStandardMaterial attach="material-2" color="#C9CDD2" />
        <meshStandardMaterial attach="material-3" color={tint} />
        <meshStandardMaterial attach="material-4" map={front} roughness={0.5} />
        <meshStandardMaterial attach="material-5" color={tint} />
      </mesh>
      <Box size={[w * 0.3, 0.8, d * 0.3]} position={[w * 0.15, h + 0.4, 0]} color="#B5BAC0" />
    </group>
  );
}

function Car({ position, rotation = 0, color }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[2, 0.55, 0.95]} position={[0, 0.42, 0]} color={color} />
      <Box size={[1.1, 0.42, 0.85]} position={[-0.1, 0.9, 0]} color="#DCE6EE" />
      {[[-0.65, 0.48], [0.65, 0.48], [-0.65, -0.48], [0.65, -0.48]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 10]} />
          <meshStandardMaterial color="#1F2226" />
        </mesh>
      ))}
    </group>
  );
}

function StreetLamp({ position }) {
  return (
    <group position={position}>
      <Box size={[0.1, 3, 0.1]} position={[0, 1.5, 0]} color="#3A3F46" />
      <Box size={[0.7, 0.1, 0.18]} position={[0.3, 3, 0]} color="#3A3F46" />
      <Box size={[0.32, 0.08, 0.2]} position={[0.55, 2.93, 0]} color="#FFE9B8" castShadow={false} />
    </group>
  );
}

function Planter({ position }) {
  return (
    <group position={position}>
      <Box size={[1.2, 0.5, 1.2]} position={[0, 0.25, 0]} color="#B9B4AC" />
      <mesh position={[0, 0.95, 0]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#5E9A62" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

// ─── People ─────────────────────────────────────────────────────────────────

const PEOPLE = [
  { shirt: '#2A9D8F', skin: '#C68A62', hair: '#2B2016' },
  { shirt: '#3559C7', skin: '#8D5A3B', hair: '#1A1410' },
  { shirt: '#6E9E7E', skin: '#E8C2A0', hair: '#8A5A2B' },
  { shirt: '#9A85E0', skin: '#B07650', hair: '#2B2016' },
  { shirt: '#E0A423', skin: '#F0CFB2', hair: '#4A3020' },
  { shirt: '#E07A5F', skin: '#6E4630', hair: '#141010' },
  { shirt: '#2B2722', skin: '#D9A77E', hair: '#5A3A22' },
  { shirt: '#5B7FD6', skin: '#A7704C', hair: '#1A1410' },
];

// Each route is a loop of [x, z] points on open floor or on the pavement outside.
const ROUTES = [
  { pts: [[-12, 13], [12, 13], [14, 11], [14, -9], [12, -9.6], [14, -9], [14, 11], [12, 13]], speed: 1.15, person: 0 },
  { pts: [[14.2, 8], [14.2, -6], [14.2, 8]], speed: 0.9, person: 1, offset: 0.4 },
  { pts: [[4, 13.6], [-11, 13.6], [4, 13.6]], speed: 1.0, person: 2, offset: 0.6 },
  // inside rooms, along the open front of each room
  { pts: [[-2.8, 2.6], [2.6, 2.4], [-2.8, 2.6]], speed: 0.7, person: 3, room: [0, 0] },
  { pts: [[-2.4, 2.2], [2.8, 2.0], [-2.4, 2.2]], speed: 0.6, person: 4, room: [9, 0], offset: 0.3 },
  { pts: [[-2.6, 2.4], [2.4, 2.6], [-2.6, 2.4]], speed: 0.65, person: 5, room: [0, -8], offset: 0.7 },
  { pts: [[2.6, 2.4], [-2.4, 2.0], [2.6, 2.4]], speed: 0.55, person: 6, room: [-9, 8], offset: 0.2 },
  { pts: [[-2.6, 2.3], [2.4, 1.9], [-2.6, 2.3]], speed: 0.6, person: 7, room: [-9, 0], offset: 0.5 },
];

function routeLength(pts) {
  let len = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const [ax, az] = pts[i];
    const [bx, bz] = pts[(i + 1) % pts.length];
    len += Math.hypot(bx - ax, bz - az);
  }
  return len;
}

function pointAt(pts, d) {
  for (let i = 0; i < pts.length; i += 1) {
    const [ax, az] = pts[i];
    const [bx, bz] = pts[(i + 1) % pts.length];
    const seg = Math.hypot(bx - ax, bz - az);
    if (d <= seg) {
      const t = seg ? d / seg : 0;
      return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, dir: Math.atan2(bx - ax, bz - az) };
    }
    d -= seg;
  }
  return { x: pts[0][0], z: pts[0][1], dir: 0 };
}

function Walker({ route }) {
  const ref = useRef();
  const body = useRef();
  const look = PEOPLE[route.person % PEOPLE.length];
  const len = useMemo(() => routeLength(route.pts), [route]);
  const [ox, oz] = route.room || [0, 0];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // walk for a stretch, then pause briefly, so it feels like people rather than a conveyor
    const cycle = len / route.speed + 3;
    const local = ((t + (route.offset || 0) * cycle) % cycle);
    const moving = local < len / route.speed && !reduceMotion;
    const d = Math.min(len, local * route.speed);
    const p = pointAt(route.pts, reduceMotion ? len * (route.offset || 0) : d);
    if (!ref.current) return;
    ref.current.position.set(ox + p.x, 0, oz + p.z);
    ref.current.rotation.y = p.dir;
    if (body.current) body.current.position.y = moving ? Math.abs(Math.sin(t * 7)) * 0.06 : 0;
  });

  return (
    <group ref={ref}>
      <group ref={body}>
        <mesh position={[0.1, 0.38, 0]} castShadow><boxGeometry args={[0.16, 0.76, 0.2]} /><meshStandardMaterial color="#2E3440" flatShading /></mesh>
        <mesh position={[-0.1, 0.38, 0]} castShadow><boxGeometry args={[0.16, 0.76, 0.2]} /><meshStandardMaterial color="#2E3440" flatShading /></mesh>
        <mesh position={[0, 1.12, 0]} castShadow><capsuleGeometry args={[0.24, 0.42, 3, 8]} /><meshStandardMaterial color={look.shirt} roughness={0.8} flatShading /></mesh>
        <mesh position={[0, 1.66, 0]} castShadow><sphereGeometry args={[0.2, 12, 10]} /><meshStandardMaterial color={look.skin} roughness={0.8} /></mesh>
        <mesh position={[0, 1.76, -0.03]}><sphereGeometry args={[0.21, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={look.hair} roughness={0.9} /></mesh>
      </group>
    </group>
  );
}

const LANE_X = Array.from({ length: 19 }, (_, i) => -26 + i * 3);
const LANE_Z = Array.from({ length: 15 }, (_, i) => -26 + i * 3);

export function Campus() {
  return (
    <group>
      {/* city ground, pavement around the building, and two roads */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#CFCAC1" roughness={1} />
      </mesh>
      <mesh position={[0.5, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[31, 28]} />
        <meshStandardMaterial color="#E6E0D5" roughness={1} />
      </mesh>
      <mesh position={[0, -0.03, 19]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 6]} />
        <meshStandardMaterial color="#55595F" roughness={1} />
      </mesh>
      <mesh position={[20, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 90]} />
        <meshStandardMaterial color="#55595F" roughness={1} />
      </mesh>
      {LANE_X.map(x => <Box key={`lx${x}`} size={[1.4, 0.02, 0.16]} position={[x, 0, 19]} color="#F2EFE8" castShadow={false} />)}
      {LANE_Z.map(z => <Box key={`lz${z}`} size={[0.16, 0.02, 1.4]} position={[20, 0, z]} color="#F2EFE8" castShadow={false} />)}
      {[0, 1, 2, 3, 4].map(i => <Box key={`zb${i}`} size={[0.5, 0.02, 4.4]} position={[11 + i * 0.9, 0, 19]} color="#F2EFE8" castShadow={false} />)}

      {/* office towers on the next blocks */}
      <Tower position={[-24, 0, -10]} size={[8, 16, 10]} tint="#7F8A97" />
      <Tower position={[-30, 0, -24]} size={[10, 22, 8]} tint="#9AA3AE" />
      <Tower position={[-2, 0, -26]} size={[9, 13, 7]} tint="#8592A0" />
      <Tower position={[8, 0, -26]} size={[8, 19, 8]} tint="#A3A9B2" />
      <Tower position={[29, 0, -12]} size={[8, 14, 10]} tint="#8D97A3" />

      <Billboard position={[-14.2, 0, -13.2]} rotation={Math.PI / 4} />

      {/* street furniture */}
      {[-10, -2, 6].map(x => <StreetLamp key={x} position={[x, 0, 15.6]} />)}
      {[-6, 4].map(z => <StreetLamp key={`s${z}`} position={[16.4, 0, z]} />)}
      <Planter position={[-12, 0, 14.6]} />
      <Planter position={[10.5, 0, 14.6]} />
      <Planter position={[15.4, 0, 9]} />
      <Car position={[-14, 0, 17]} color="#3559C7" />
      <Car position={[-5.5, 0, 17]} color="#E8E3DA" />
      <Car position={[8, 0, 21]} rotation={Math.PI} color="#C8372D" />
      <Car position={[18, 0, -3]} rotation={Math.PI / 2} color="#2B2722" />
      <Car position={[18, 0, 9]} rotation={Math.PI / 2} color="#E0A423" />

      {ROUTES.map((r, i) => <Walker key={i} route={r} />)}
    </group>
  );
}
