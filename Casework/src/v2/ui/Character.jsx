// Illustrated cast members — flat, slightly chibi proportions so faces read at small sizes.
// Each look is data; expressions come from `mood`; `talking` animates the mouth.

const LOOKS = {
  rhea: { skin: '#C98A63', shade: '#AD7050', hair: '#1D1715', hairStyle: 'long', top: '#C8553D', topShade: '#A8432F', under: '#F3E6D3', pants: '#2E2A27', shoe: '#1A1715', earrings: '#E0B04A' },
  priya: { skin: '#A86F4C', shade: '#8E5B3C', hair: '#2A1B14', hairStyle: 'bun', top: '#6E9E7E', topShade: '#5A8668', under: '#F4EFE6', pants: '#3C4A5C', shoe: '#2A2420', glasses: 'round' },
  marcus: { skin: '#EFC5A3', shade: '#D9A986', hair: '#6B4A2E', hairStyle: 'short', beard: '#7A5536', top: '#2F4A7A', topShade: '#253D66', under: '#2F4A7A', pants: '#5E5A55', shoe: '#F2EEE8', lanyard: '#FF6B2C' },
  jonas: { skin: '#F2D3BC', shade: '#DDB79C', hair: '#D9B86A', hairStyle: 'messy', top: '#2A2A2E', topShade: '#1E1E22', under: '#2A2A2E', pants: '#4A5A6E', shoe: '#2A2A2E', glasses: 'square', headphones: '#E9E4DA' },
  ana: { skin: '#8D5A3B', shade: '#74472D', hair: '#1F1410', hairStyle: 'puff', top: '#E0A423', topShade: '#C48C16', under: '#E0A423', pants: '#3A2E2A', shoe: '#C8553D', earrings: '#F2D27A', hoops: true },
  kofi: { skin: '#6B4226', shade: '#57341C', hair: '#16100C', hairStyle: 'fade', top: '#1F2F4A', topShade: '#16233A', under: '#FAF7F1', tie: '#FF6B2C', pants: '#1F2F4A', shoe: '#5A3A22' },
  lena: { skin: '#EBC3A2', shade: '#D6A985', hair: '#B5482F', hairStyle: 'bob', top: '#9A85E0', topShade: '#836DCC', under: '#9A85E0', pants: '#2F3340', shoe: '#F2EEE8' },
  sam: { skin: '#D9A27E', shade: '#C28966', hair: '#3A2620', hairStyle: 'wavy', beanie: '#FF6B2C', top: '#5C7FB8', topShade: '#4A6BA0', under: '#F7E6A6', pants: '#2F3340', shoe: '#E9E4DA' },
  dana: { skin: '#B97D57', shade: '#9E6644', hair: '#C9C4BD', hairStyle: 'pixie', top: '#1E1E22', topShade: '#141418', under: '#1E1E22', pants: '#1E1E22', shoe: '#C8553D', glasses: 'bold' },
};

function HairBack({ look }) {
  const c = look.hair;
  switch (look.hairStyle) {
    case 'long':
      return <path d="M30 44 C28 18 92 18 90 44 L94 104 C80 112 40 112 26 104 Z" fill={c} />;
    case 'bob':
      return <path d="M28 46 C28 16 92 16 92 46 L94 82 C80 90 40 90 26 82 Z" fill={c} />;
    case 'bun':
      return <circle cx="60" cy="14" r="13" fill={c} />;
    case 'puff':
      return <ellipse cx="60" cy="28" rx="44" ry="34" fill={c} />;
    case 'wavy':
      return <path d="M28 52 C24 20 96 20 92 52 L92 66 L28 66 Z" fill={c} />;
    default:
      return null;
  }
}

function HairFront({ look }) {
  const c = look.hair;
  switch (look.hairStyle) {
    case 'long':
      return <path d="M27 54 C23 14 97 14 93 54 C90 40 80 30 62 31 C48 32 36 40 27 54 Z" fill={c} />;
    case 'bob':
      return <path d="M27 56 C23 14 97 14 93 56 C88 44 78 34 60 33 C48 34 36 42 27 56 Z" fill={c} />;
    case 'bun':
      return <path d="M30 46 C30 20 90 20 90 46 C84 34 70 26 60 26 C50 26 36 34 30 46 Z" fill={c} />;
    case 'short':
      return <path d="M30 44 C30 16 90 16 90 44 C86 32 74 26 62 28 C50 24 36 30 30 44 Z" fill={c} />;
    case 'messy':
      return <path d="M28 46 L32 22 L42 28 L46 14 L56 24 L64 12 L70 24 L80 16 L82 30 L92 28 L90 46 C80 34 40 34 28 46 Z" fill={c} />;
    case 'puff':
      return <path d="M30 42 C34 26 86 26 90 42 C80 36 40 36 30 42 Z" fill={c} />;
    case 'fade':
      return <path d="M31 42 C32 22 88 22 89 42 C80 34 40 34 31 42 Z" fill={c} />;
    case 'wavy':
      return <path d="M30 48 C30 26 90 26 90 48 C84 42 78 40 72 42 C66 38 58 38 52 42 C44 38 36 42 30 48 Z" fill={c} />;
    case 'pixie':
      return <path d="M29 46 C28 16 92 16 91 44 C82 30 64 24 44 30 C38 34 32 40 29 46 Z" fill={c} />;
    default:
      return null;
  }
}

function Eyes({ mood }) {
  // Eyes sit at y≈58; blinking is a CSS scaleY animation on the group.
  if (mood === 'happy') {
    return (
      <g className="ch-eyes" stroke="#1C1612" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M43 59 Q48 53 53 59" />
        <path d="M67 59 Q72 53 77 59" />
      </g>
    );
  }
  if (mood === 'annoyed') {
    return (
      <g className="ch-eyes" fill="#1C1612">
        <rect x="43" y="57" width="10" height="3.4" rx="1.7" />
        <rect x="67" y="57" width="10" height="3.4" rx="1.7" />
      </g>
    );
  }
  const r = mood === 'excited' ? 4.6 : 3.6;
  const dx = mood === 'thinking' ? 2 : 0;
  const dy = mood === 'thinking' ? -2 : 0;
  return (
    <g className="ch-eyes" fill="#1C1612">
      <circle cx={48 + dx} cy={58 + dy} r={r} />
      <circle cx={72 + dx} cy={58 + dy} r={r} />
      {mood === 'excited' && (
        <g fill="#fff">
          <circle cx="49.5" cy="56.4" r="1.4" />
          <circle cx="73.5" cy="56.4" r="1.4" />
        </g>
      )}
    </g>
  );
}

function Brows({ mood, color }) {
  const p = {
    neutral: ['M42 49 L54 48', 'M66 48 L78 49'],
    happy: ['M42 48 Q48 45 54 47', 'M66 47 Q72 45 78 48'],
    worried: ['M42 49 L54 45', 'M66 45 L78 49'],
    annoyed: ['M42 46 L54 50', 'M66 50 L78 46'],
    thinking: ['M42 48 L54 48', 'M66 45 Q72 42 78 46'],
    excited: ['M42 45 Q48 41 54 44', 'M66 44 Q72 41 78 45'],
  }[mood] || ['M42 49 L54 48', 'M66 48 L78 49'];
  return (
    <g stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
      <path d={p[0]} />
      <path d={p[1]} />
    </g>
  );
}

function Mouth({ mood }) {
  const closed = {
    neutral: <path d="M53 72 Q60 76 67 72" stroke="#7A3B2E" strokeWidth="2.6" strokeLinecap="round" fill="none" />,
    happy: <path d="M50 70 Q60 82 70 70 Z" fill="#7A3B2E" />,
    worried: <path d="M53 75 Q60 70 67 75" stroke="#7A3B2E" strokeWidth="2.6" strokeLinecap="round" fill="none" />,
    annoyed: <path d="M53 73 L67 73" stroke="#7A3B2E" strokeWidth="2.8" strokeLinecap="round" />,
    thinking: <path d="M56 73 Q62 71 67 74" stroke="#7A3B2E" strokeWidth="2.6" strokeLinecap="round" fill="none" />,
    excited: <path d="M50 69 Q60 84 70 69 Z" fill="#7A3B2E" />,
  }[mood];
  return (
    <g>
      <g className="ch-mouth-closed">{closed}</g>
      <ellipse className="ch-mouth-open" cx="60" cy="73" rx="6" ry="5" fill="#7A3B2E" />
    </g>
  );
}

function Glasses({ kind }) {
  if (!kind) return null;
  const stroke = kind === 'bold' ? '#1C1612' : '#3A3330';
  const sw = kind === 'bold' ? 3.2 : 2.2;
  if (kind === 'round') {
    return (
      <g stroke={stroke} strokeWidth={sw} fill="rgba(255,255,255,0.18)">
        <circle cx="48" cy="58" r="8.5" />
        <circle cx="72" cy="58" r="8.5" />
        <path d="M56.5 58 L63.5 58" fill="none" />
      </g>
    );
  }
  return (
    <g stroke={stroke} strokeWidth={sw} fill="rgba(255,255,255,0.18)">
      <rect x="38" y="51" width="19" height="14" rx={kind === 'bold' ? 3 : 4} />
      <rect x="63" y="51" width="19" height="14" rx={kind === 'bold' ? 3 : 4} />
      <path d="M57 57 L63 57" fill="none" />
    </g>
  );
}

export default function Character({ id, mood = 'neutral', talking = false, size = 120, className = '', title }) {
  const look = LOOKS[id];
  if (!look) return null;
  const browColor = look.hairStyle === 'pixie' ? '#6E665E' : look.hair;
  return (
    <svg
      className={`ch ${talking ? 'ch--talking' : ''} ${className}`}
      viewBox="0 0 120 230"
      width={size}
      height={(size * 230) / 120}
      role="img"
      aria-label={title || id}
    >
      <ellipse cx="60" cy="224" rx="34" ry="5" fill="rgba(31,26,20,0.16)" />
      <g className="ch-body">
        {/* long hair falls behind the shoulders */}
        <g className="ch-hair-back"><HairBack look={look} /></g>
        {/* legs & shoes */}
        <rect x="44" y="160" width="13" height="58" rx="6" fill={look.pants} />
        <rect x="63" y="160" width="13" height="58" rx="6" fill={look.pants} />
        <ellipse cx="49" cy="219" rx="10" ry="5.5" fill={look.shoe} />
        <ellipse cx="71" cy="219" rx="10" ry="5.5" fill={look.shoe} />

        {/* torso */}
        <path d="M32 112 Q32 96 48 94 L72 94 Q88 96 88 112 L88 168 Q60 174 32 168 Z" fill={look.top} />
        <path d="M60 94 L72 94 Q88 96 88 112 L88 168 Q74 171 60 172 Z" fill={look.topShade} opacity="0.55" />
        {look.under !== look.top && <path d="M52 94 L60 112 L68 94 Z" fill={look.under} />}
        {look.tie && <path d="M58 100 L62 100 L64 130 L60 136 L56 130 Z" fill={look.tie} />}
        {look.lanyard && (
          <>
            <path d="M50 95 L58 128 M70 95 L62 128" stroke={look.lanyard} strokeWidth="2.4" fill="none" />
            <rect x="53" y="127" width="14" height="18" rx="2.5" fill="#FAF7F1" />
          </>
        )}

        {/* arms */}
        <g className="ch-arms">
          <path d="M33 104 Q24 128 28 156" stroke={look.top} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M87 104 Q96 128 92 156" stroke={look.topShade} strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="158" r="6.5" fill={look.skin} />
          <circle cx="92" cy="158" r="6.5" fill={look.shade} />
        </g>

        {/* neck */}
        <rect x="53" y="82" width="14" height="16" rx="5" fill={look.shade} />

        {/* head */}
        <g className="ch-head">
          {look.headphones && <path d="M26 58 C26 20 94 20 94 58" stroke={look.headphones} strokeWidth="5" fill="none" transform="translate(0 30) scale(1 0.9)" />}
          <ellipse cx="29" cy="60" rx="5" ry="7" fill={look.shade} />
          <ellipse cx="91" cy="60" rx="5" ry="7" fill={look.shade} />
          {look.earrings && (look.hoops
            ? <><circle cx="28" cy="72" r="5" stroke={look.earrings} strokeWidth="2" fill="none" /><circle cx="92" cy="72" r="5" stroke={look.earrings} strokeWidth="2" fill="none" /></>
            : <><circle cx="28" cy="70" r="2.4" fill={look.earrings} /><circle cx="92" cy="70" r="2.4" fill={look.earrings} /></>)}
          <ellipse cx="60" cy="56" rx="31" ry="33" fill={look.skin} />
          {look.beard && <path d="M33 62 Q36 92 60 92 Q84 92 87 62 Q84 80 60 82 Q36 80 33 62 Z" fill={look.beard} opacity="0.85" />}
          <HairFront look={look} />
          {look.beanie && (
            <>
              <path d="M27 42 C27 6 93 6 93 42 Z" fill={look.beanie} />
              <rect x="25" y="36" width="70" height="10" rx="5" fill={look.beanie} />
              <rect x="25" y="36" width="70" height="10" rx="5" fill="rgba(0,0,0,0.12)" />
            </>
          )}
          <Brows mood={mood} color={browColor} />
          <Eyes mood={mood} />
          <path d="M60 62 Q57 67 60.5 68" stroke={look.shade} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <Glasses kind={look.glasses} />
          {(mood === 'happy' || mood === 'excited') && (
            <g fill="#E8766A" opacity="0.35">
              <ellipse cx="40" cy="68" rx="5" ry="3" />
              <ellipse cx="80" cy="68" rx="5" ry="3" />
            </g>
          )}
          <Mouth mood={mood} />
        </g>
      </g>
    </svg>
  );
}

// Head-and-shoulders crop for avatars and the dialogue box.
export function Portrait({ id, mood = 'neutral', size = 44, talking = false }) {
  const look = LOOKS[id];
  if (!look) return null;
  return (
    <span className="portrait" style={{ width: size, height: size, '--portrait-bg': look.top }}>
      <Character id={id} mood={mood} talking={talking} size={size * 1.3} />
    </span>
  );
}
