// The Launchly office: nine rooms in a 3×3 grid, cutaway style (back + left walls only).
import {
  BeanBag, Box, Chair, Counter, Desk, Frame, Fridge, Lamp, Laptop, Monitor, PALETTE as P,
  Plant, RoundTable, Rug, Shelf, Sofa, Tripod, TV, Whiteboard, Window,
} from './props';

export const ROOM_W = 8;
export const ROOM_D = 7;
const WALL_H = 2.6;

// Character slots are local [x, z] positions on the open (camera-facing) side of each room.
export const ROOMS = {
  'ceo-office':   { label: 'Rhea\'s office', at: [-9, -8], floor: '#D9BF9C', wall: '#F5EEE3', slots: [[-1.4, 1.1], [0.6, 1.6], [2.3, 0.9], [-3.0, 2.0]] },
  'meeting-room': { label: 'Meeting room',   at: [0, -8],  floor: '#C9D6DF', wall: '#EEF1F4', accent: '#BFD0EA', slots: [[-1.9, 1.6], [0.1, 2.1], [2.1, 1.5], [-3.0, 2.5]] },
  'research-lab': { label: 'Research lab',   at: [9, -8],  floor: '#DFD3EA', wall: '#F3EFF7', slots: [[-1.2, 1.4], [0.8, 1.9], [2.4, 1.2], [-3.0, 2.3]] },
  'design-desk':  { label: 'Design corner',  at: [-9, 0],  floor: '#F1D9C2', wall: '#FBF3E9', accent: '#F6C9A9', slots: [[-1.6, 1.5], [0.4, 2.0], [2.2, 1.3], [-3.0, 2.4]] },
  'eng-pod':      { label: 'Engineering',    at: [0, 0],   floor: '#D0E0CE', wall: '#F0F5EE', slots: [[-1.8, 1.9], [0.2, 2.3], [2.2, 1.7], [-3.0, 2.8]] },
  kitchen:        { label: 'Kitchen',        at: [9, 0],   floor: '#EFE4CF', wall: '#FBF6EC', accent: '#F2D58A', slots: [[-1.6, 1.4], [0.4, 1.9], [2.3, 1.2], [-3.0, 2.3]] },
  lounge:         { label: 'Lounge',         at: [-9, 8],  floor: '#E9D0CB', wall: '#FAF1EE', slots: [[-1.4, 2.0], [0.6, 2.4], [2.4, 1.7], [-3.0, 2.9]] },
  'video-call':   { label: 'Call booth',     at: [0, 8],   floor: '#D7D3ED', wall: '#F2F0FA', accent: '#C8BFF0', slots: [[-1.4, 1.6], [0.6, 2.0], [2.4, 1.4], [-3.0, 2.5]] },
  reception:      { label: 'Reception',      at: [9, 8],   floor: '#ECE0C9', wall: '#FBF5EA', slots: [[-1.2, 1.6], [0.8, 2.0], [2.4, 1.4], [-3.0, 2.5]] },
};

function Shell({ room }) {
  const [cx, cz] = room.at;
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color={room.floor} roughness={0.95} />
      </mesh>
      {/* back (north) wall + left (west) wall */}
      <Box size={[ROOM_W, WALL_H, 0.18]} position={[0, WALL_H / 2, -ROOM_D / 2]} color={room.accent || room.wall} />
      <Box size={[0.18, WALL_H, ROOM_D]} position={[-ROOM_W / 2, WALL_H / 2, 0]} color={room.wall} />
      {/* skirting trims for a crisp edge */}
      <Box size={[ROOM_W, 0.1, 0.22]} position={[0, WALL_H, -ROOM_D / 2]} color="#FFFFFF" castShadow={false} />
      <Box size={[0.22, 0.1, ROOM_D]} position={[-ROOM_W / 2, WALL_H, 0]} color="#FFFFFF" castShadow={false} />
      {/* low front kerbs so rooms read as rooms */}
      <Box size={[ROOM_W, 0.12, 0.12]} position={[0, 0.06, ROOM_D / 2]} color={room.wall} castShadow={false} />
      <Box size={[0.12, 0.12, ROOM_D]} position={[ROOM_W / 2, 0.06, 0]} color={room.wall} castShadow={false} />
    </group>
  );
}

const BACK = -ROOM_D / 2 + 0.12;
const LEFT = -ROOM_W / 2 + 0.12;
const FACE_RIGHT = Math.PI / 2;

function Furniture({ id }) {
  switch (id) {
    case 'ceo-office':
      return (
        <>
          <Window position={[0.5, 1.5, BACK]} w={2.4} />
          <Shelf position={[LEFT + 0.2, 0, -0.6]} rotation={FACE_RIGHT} w={1.6} />
          <Frame position={[LEFT + 0.04, 1.9, 1.4]} rotation={FACE_RIGHT} color={P.orange} w={0.8} h={0.6} />
          <Rug position={[0.4, 0, -0.6]} w={3.6} d={2.4} color="#B5472F" />
          <Desk position={[0.4, 0, -1.6]} w={2.2} d={0.9} top={P.woodDark} />
          <Monitor position={[0.6, 0, -1.8]} wide />
          <Chair position={[0.4, 0, -2.4]} color="#3A2F2A" />
          <Chair position={[-0.3, 0, -0.6]} rotation={Math.PI} color={P.white} />
          <Chair position={[1.1, 0, -0.6]} rotation={Math.PI} color={P.white} />
          <Plant position={[-3.2, 0, -2.9]} tall scale={1.2} />
          <Plant position={[3.2, 0, -2.9]} />
          {/* glass partitions on the open sides */}
          <mesh position={[ROOM_W / 2, 1.3, 0]}>
            <boxGeometry args={[0.04, 2.6, ROOM_D]} />
            <meshStandardMaterial color="#BFD9F2" transparent opacity={0.16} />
          </mesh>
        </>
      );
    case 'meeting-room':
      return (
        <>
          <TV position={[0.6, 0, BACK]} w={2} glow="#F4B79A" />
          <Whiteboard position={[LEFT, 0, -0.2]} rotation={FACE_RIGHT} w={2.4} />
          <Box size={[3.4, 0.07, 1.3]} position={[0.5, 0.74, -0.8]} color={P.white} />
          <Box size={[0.14, 0.72, 0.6]} position={[-0.7, 0.36, -0.8]} color={P.ink} />
          <Box size={[0.14, 0.72, 0.6]} position={[1.7, 0.36, -0.8]} color={P.ink} />
          {[-0.6, 0.5, 1.6].map((x, i) => <Chair key={`b${i}`} position={[x, 0, -1.7]} color={P.blue} />)}
          {[-0.6, 0.5, 1.6].map((x, i) => <Chair key={`f${i}`} position={[x, 0, 0.1]} rotation={Math.PI} color={P.blue} />)}
          <Laptop position={[0.1, 0, -0.9]} />
          <Plant position={[3.3, 0, -2.9]} tall />
        </>
      );
    case 'research-lab':
      return (
        <>
          {/* one-way mirror */}
          <mesh position={[0.4, 1.5, BACK + 0.02]}>
            <planeGeometry args={[3.4, 1.3]} />
            <meshStandardMaterial color="#3B3F55" roughness={0.2} metalness={0.4} />
          </mesh>
          <Desk position={[0.2, 0, -1.4]} w={1.8} />
          <Laptop position={[0.2, 0, -1.4]} />
          <Chair position={[-0.3, 0, -0.6]} rotation={Math.PI} color={P.lilac} />
          <Chair position={[0.8, 0, -2.1]} color={P.lilac} />
          <Tripod position={[-2.2, 0, -0.8]} rotation={0.6} />
          <Shelf position={[LEFT + 0.2, 0, 1.2]} rotation={FACE_RIGHT} />
          <Plant position={[3.2, 0, -2.8]} />
          <Rug position={[0.2, 0, -1]} w={3} d={2.2} color="#C9B8E6" />
        </>
      );
    case 'design-desk':
      return (
        <>
          <Whiteboard position={[-0.4, 0, BACK]} w={3.2} />
          <Frame position={[LEFT + 0.04, 1.8, -1]} rotation={FACE_RIGHT} color={P.sage} />
          <Frame position={[LEFT + 0.04, 1.6, 0.2]} rotation={FACE_RIGHT} color={P.mustard} w={0.5} h={0.7} />
          <Desk position={[-1.4, 0, -1.6]} w={1.8} />
          <Monitor position={[-1.4, 0, -1.8]} wide glow="#FFD3B8" />
          <Chair position={[-1.4, 0, -0.9]} rotation={Math.PI} color={P.orange} />
          <Desk position={[1.4, 0, -1.6]} w={1.8} />
          <Monitor position={[1.4, 0, -1.8]} glow="#C8E6C9" />
          <Chair position={[1.4, 0, -0.9]} rotation={Math.PI} color={P.sage} />
          <Lamp position={[3.2, 0, -2.8]} />
          <Plant position={[-3.2, 0, 2.6]} tall />
        </>
      );
    case 'eng-pod':
      return (
        <>
          <Window position={[-1.6, 1.5, BACK]} w={1.8} />
          <Window position={[1.6, 1.5, BACK]} w={1.8} />
          {[[-1.2, -1.8], [1.2, -1.8], [-1.2, -0.6], [1.2, -0.6]].map(([x, z], i) => (
            <group key={i}>
              <Desk position={[x, 0, z]} w={1.6} d={0.7} rotation={i < 2 ? 0 : Math.PI} />
              <Monitor position={[x - 0.35, 0, z + (i < 2 ? -0.15 : 0.15)]} rotation={i < 2 ? 0 : Math.PI} glow="#1E2A3A" />
              <Monitor position={[x + 0.35, 0, z + (i < 2 ? -0.15 : 0.15)]} rotation={i < 2 ? 0 : Math.PI} glow="#A6E3B8" />
            </group>
          ))}
          <Shelf position={[LEFT + 0.2, 0, 0.8]} rotation={FACE_RIGHT} />
          <Plant position={[3.3, 0, 2.6]} />
        </>
      );
    case 'kitchen':
      return (
        <>
          <Counter position={[0.4, 0, BACK + 0.35]} w={3.2} />
          <Fridge position={[-2.8, 0, BACK + 0.4]} />
          <Window position={[0.4, 1.75, BACK]} w={2} h={0.7} />
          <RoundTable position={[0.6, 0, -0.4]} r={0.6} />
          <Chair position={[-0.2, 0, -0.4]} rotation={FACE_RIGHT} color={P.mustard} />
          <Chair position={[1.4, 0, -0.4]} rotation={-FACE_RIGHT} color={P.mustard} />
          <Plant position={[3.2, 0, -2.6]} />
        </>
      );
    case 'lounge':
      return (
        <>
          <Window position={[0.4, 1.5, BACK]} w={3} />
          <Rug position={[0.2, 0, -0.8]} w={3.4} round color="#F2C46B" />
          <Sofa position={[0.2, 0, -2.3]} w={2.6} color={P.rose} />
          <BeanBag position={[-1.8, 0, -0.4]} color={P.sage} />
          <BeanBag position={[2.0, 0, -0.6]} color={P.blue} />
          <RoundTable position={[0.2, 0, -1.1]} r={0.4} />
          <Lamp position={[-3.1, 0, -2.8]} />
          <Shelf position={[LEFT + 0.2, 0, 0.8]} rotation={FACE_RIGHT} />
          <Plant position={[3.2, 0, -2.8]} tall scale={1.2} />
        </>
      );
    case 'video-call':
      return (
        <>
          <TV position={[0.4, 0.1, BACK]} w={2.6} glow="#B9C8F5" />
          {/* call grid on the screen */}
          {[[-0.55, 1.9], [0.4, 1.9], [1.35, 1.9], [-0.55, 1.4], [0.4, 1.4], [1.35, 1.4]].map(([x, y], i) => (
            <mesh key={i} position={[x, y - 0.2 + 0.1, BACK + 0.06]}>
              <planeGeometry args={[0.85, 0.42]} />
              <meshBasicMaterial color={['#F4B79A', '#C8E6C9', '#F2D58A', '#C9B8E6', '#A9C7EE', '#F0C2B8'][i]} />
            </mesh>
          ))}
          <Desk position={[0.4, 0, -1.4]} w={2.2} />
          <Laptop position={[0.4, 0, -1.3]} />
          <Chair position={[0.4, 0, -0.6]} rotation={Math.PI} color={P.lilac} />
          <Plant position={[-3.2, 0, -2.8]} />
          <Frame position={[LEFT + 0.04, 1.7, -0.4]} rotation={FACE_RIGHT} color={P.blue} />
        </>
      );
    case 'reception':
      return (
        <>
          {/* the Launchly sign */}
          <Box size={[2.4, 0.7, 0.08]} position={[0.4, 1.8, BACK + 0.05]} color={P.orange} castShadow={false} />
          <Box size={[0.4, 0.4, 0.1]} position={[-0.5, 1.8, BACK + 0.1]} color={P.white} castShadow={false} />
          <Box size={[2.6, 1.05, 0.7]} position={[0.4, 0.52, -1.6]} color={P.white} />
          <Box size={[2.7, 0.06, 0.8]} position={[0.4, 1.07, -1.6]} color={P.woodDark} />
          <Monitor position={[0.9, 0.32, -1.75]} />
          <Sofa position={[LEFT + 0.6, 0, 0.4]} rotation={FACE_RIGHT} w={2.2} color={P.sage} />
          <Plant position={[3.2, 0, -2.8]} tall scale={1.3} />
          <Plant position={[-3.2, 0, -2.8]} />
        </>
      );
    default:
      return null;
  }
}

export function World() {
  return (
    <group>
      {/* ground: the building floor + corridors */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 27]} />
        <meshStandardMaterial color="#E4D7C2" roughness={1} />
      </mesh>
      {Object.entries(ROOMS).map(([id, room]) => (
        <group key={id}>
          <Shell room={room} />
          <group position={[room.at[0], 0, room.at[1]]}>
            <Furniture id={id} />
          </group>
        </group>
      ))}
    </group>
  );
}
