// Low-poly office furniture, built from primitives so the whole office ships as code (no model downloads).
// Units ≈ metres. Everything sits on y = 0.

const C = {
  wood: '#C99A6B',
  woodDark: '#9C7250',
  white: '#F7F3EC',
  ink: '#2B2722',
  steel: '#8C939C',
  screen: '#22272F',
  screenGlow: '#9CC3F5',
  orange: '#FF6B2C',
  sage: '#6E9E7E',
  leaf: '#4F8A5B',
  leaf2: '#6BAA6F',
  pot: '#D9B48F',
  blue: '#5B7FD6',
  rose: '#E07A5F',
  mustard: '#E0A423',
  lilac: '#9A85E0',
};

function M({ color, ...rest }) {
  return <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} flatShading {...rest} />;
}

export function Box({ size, position, color, rotation, castShadow = true, receiveShadow = true }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <M color={color} />
    </mesh>
  );
}

export function Desk({ position = [0, 0, 0], rotation = 0, w = 1.6, d = 0.8, top = C.white, legs = C.ink }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 0.06, d]} position={[0, 0.74, 0]} color={top} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
        <Box key={i} size={[0.05, 0.72, 0.05]} position={[x * (w / 2 - 0.06), 0.36, z * (d / 2 - 0.06)]} color={legs} />
      ))}
    </group>
  );
}

export function Monitor({ position = [0, 0, 0], rotation = 0, wide = false, glow = C.screenGlow }) {
  const w = wide ? 0.9 : 0.6;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[0.08, 0.28, 0.08]} position={[0, 0.91, 0]} color={C.ink} />
      <Box size={[0.24, 0.02, 0.16]} position={[0, 0.78, 0]} color={C.ink} />
      <Box size={[w, 0.38, 0.04]} position={[0, 1.18, 0]} color={C.screen} />
      <mesh position={[0, 1.18, 0.022]}>
        <planeGeometry args={[w - 0.06, 0.32]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Laptop({ position = [0, 0, 0], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[0.36, 0.02, 0.24]} position={[0, 0.78, 0]} color={C.steel} />
      <group position={[0, 0.79, -0.12]} rotation={[-0.35, 0, 0]}>
        <Box size={[0.36, 0.24, 0.015]} position={[0, 0.12, 0]} color={C.steel} />
        <mesh position={[0, 0.12, 0.009]}>
          <planeGeometry args={[0.32, 0.2]} />
          <meshBasicMaterial color={C.screenGlow} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function Chair({ position = [0, 0, 0], rotation = 0, color = C.orange }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[0.46, 0.08, 0.46]} position={[0, 0.46, 0]} color={color} />
      <Box size={[0.46, 0.5, 0.07]} position={[0, 0.74, -0.2]} color={color} />
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.42, 6]} />
        <M color={C.ink} />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 5]} />
        <M color={C.ink} />
      </mesh>
    </group>
  );
}

export function Plant({ position = [0, 0, 0], scale = 1, tall = false }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.44, 7]} />
        <M color={C.pot} />
      </mesh>
      <mesh position={[0, tall ? 0.95 : 0.7, 0]} castShadow>
        <icosahedronGeometry args={[tall ? 0.42 : 0.34, 0]} />
        <M color={C.leaf} />
      </mesh>
      <mesh position={[0.12, tall ? 1.35 : 0.98, 0.05]} castShadow>
        <icosahedronGeometry args={[tall ? 0.3 : 0.22, 0]} />
        <M color={C.leaf2} />
      </mesh>
    </group>
  );
}

export function Sofa({ position = [0, 0, 0], rotation = 0, color = C.rose, w = 2 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 0.4, 0.85]} position={[0, 0.25, 0]} color={color} />
      <Box size={[w, 0.5, 0.22]} position={[0, 0.6, -0.32]} color={color} />
      <Box size={[0.2, 0.35, 0.85]} position={[-w / 2 + 0.1, 0.5, 0]} color={color} />
      <Box size={[0.2, 0.35, 0.85]} position={[w / 2 - 0.1, 0.5, 0]} color={color} />
      <Box size={[w / 2 - 0.25, 0.1, 0.6]} position={[-w / 4 + 0.05, 0.5, 0.05]} color={C.white} />
      <Box size={[w / 2 - 0.25, 0.1, 0.6]} position={[w / 4 - 0.05, 0.5, 0.05]} color={C.white} />
    </group>
  );
}

export function RoundTable({ position = [0, 0, 0], r = 0.5, color = C.white }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.05, 16]} />
        <M color={color} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 6]} />
        <M color={C.ink} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 12]} />
        <M color={C.ink} />
      </mesh>
    </group>
  );
}

export function Rug({ position = [0, 0, 0], w = 2.4, d = 1.6, color = C.mustard, round = false }) {
  return round ? (
    <mesh position={[position[0], 0.012, position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[w / 2, 24]} />
      <M color={color} />
    </mesh>
  ) : (
    <mesh position={[position[0], 0.012, position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <M color={color} />
    </mesh>
  );
}

export function Whiteboard({ position = [0, 0, 0], rotation = 0, w = 2 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 1.1, 0.05]} position={[0, 1.45, 0]} color={C.white} />
      <Box size={[w + 0.08, 0.06, 0.1]} position={[0, 0.87, 0.03]} color={C.steel} />
      {/* sticky notes */}
      {[[-0.6, 1.7, C.mustard], [-0.3, 1.55, C.rose], [0.1, 1.72, C.sage], [0.45, 1.5, C.mustard], [0.7, 1.68, C.lilac]].map(([x, y, c], i) => (
        <mesh key={i} position={[x * (w / 2), y, 0.03]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0.1, 1.28, 0.03]}>
        <planeGeometry args={[w * 0.6, 0.02]} />
        <meshBasicMaterial color={C.blue} />
      </mesh>
    </group>
  );
}

export function TV({ position = [0, 0, 0], rotation = 0, w = 1.6, glow = '#F0B8A0' }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 0.9, 0.06]} position={[0, 1.55, 0]} color={C.screen} />
      <mesh position={[0, 1.55, 0.032]}>
        <planeGeometry args={[w - 0.08, 0.82]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Shelf({ position = [0, 0, 0], rotation = 0, w = 1.2 }) {
  const books = [C.orange, C.blue, C.sage, C.mustard, C.lilac, C.rose];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 1.6, 0.32]} position={[0, 0.8, 0]} color={C.wood} />
      {[0.42, 0.92, 1.42].map((y, row) => (
        <group key={row}>
          <Box size={[w - 0.08, 0.03, 0.3]} position={[0, y - 0.2, 0.02]} color={C.woodDark} castShadow={false} />
          {books.slice(row, row + 4).map((b, i) => (
            <Box key={i} size={[0.1, 0.3, 0.22]} position={[-w / 2 + 0.18 + i * 0.13, y - 0.04, 0.05]} color={b} castShadow={false} />
          ))}
        </group>
      ))}
    </group>
  );
}

export function Counter({ position = [0, 0, 0], rotation = 0, w = 2.6 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, 0.9, 0.6]} position={[0, 0.45, 0]} color={C.white} />
      <Box size={[w + 0.04, 0.05, 0.64]} position={[0, 0.92, 0]} color={C.woodDark} />
      {/* coffee machine */}
      <Box size={[0.3, 0.42, 0.3]} position={[-w / 2 + 0.35, 1.15, 0]} color={C.ink} />
      <Box size={[0.12, 0.04, 0.12]} position={[-w / 2 + 0.35, 1.0, 0.14]} color={C.orange} />
      {/* mugs */}
      {[0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.99, 0.1]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <M color={i ? C.sage : C.mustard} />
        </mesh>
      ))}
    </group>
  );
}

export function Fridge({ position = [0, 0, 0], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[0.7, 1.9, 0.65]} position={[0, 0.95, 0]} color="#DDE3E8" />
      <Box size={[0.04, 0.5, 0.04]} position={[0.28, 1.3, 0.34]} color={C.steel} />
      <mesh position={[-0.1, 1.5, 0.33]}>
        <planeGeometry args={[0.12, 0.12]} />
        <meshBasicMaterial color={C.orange} />
      </mesh>
    </group>
  );
}

export function BeanBag({ position = [0, 0, 0], color = C.mustard }) {
  return (
    <mesh position={[position[0], 0.28, position[2]]} scale={[1, 0.7, 1]} castShadow receiveShadow>
      <icosahedronGeometry args={[0.42, 1]} />
      <M color={color} />
    </mesh>
  );
}

export function Tripod({ position = [0, 0, 0], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[0, 2.1, 4.2].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.12, 0.6, Math.sin(a) * 0.12]} rotation={[Math.sin(a) * 0.2, 0, -Math.cos(a) * 0.2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 5]} />
          <M color={C.ink} />
        </mesh>
      ))}
      <Box size={[0.22, 0.16, 0.14]} position={[0, 1.26, 0]} color={C.ink} />
      <mesh position={[0, 1.26, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
        <M color={C.steel} />
      </mesh>
    </group>
  );
}

export function Lamp({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 5]} />
        <M color={C.ink} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.22, 0.26, 8, 1, true]} />
        <M color={C.mustard} side={2} />
      </mesh>
      <pointLight position={[0, 1.45, 0]} intensity={2} distance={3} color="#FFD9A0" />
    </group>
  );
}

export function Frame({ position = [0, 0, 0], rotation = 0, w = 0.6, h = 0.45, color = C.orange }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[w, h, 0.03]} position={[0, 0, 0]} color={C.ink} castShadow={false} />
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[w - 0.06, h - 0.06]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export function Window({ position = [0, 0, 0], rotation = 0, w = 1.6, h = 1.1 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#CFE3F5" />
      </mesh>
      <Box size={[w + 0.06, 0.05, 0.06]} position={[0, -h / 2, 0.03]} color={C.white} castShadow={false} />
      <Box size={[0.04, h, 0.04]} position={[0, 0, 0.03]} color={C.white} castShadow={false} />
    </group>
  );
}

export const PALETTE = C;
