import React, { useMemo } from 'react';

const HEX_RE = /#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;

function isLightColor(hex) {
  const raw = hex.replace('#', '');
  let r;
  let g;
  let b;
  if (raw.length === 3 || raw.length === 4) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.72;
}

function parseSegments(text) {
  if (!text || typeof text !== 'string') return [{ type: 'text', value: text ?? '' }];

  const segments = [];
  let last = 0;
  HEX_RE.lastIndex = 0;
  let match;
  while ((match = HEX_RE.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: text.slice(last, match.index) });
    }
    segments.push({ type: 'hex', value: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }
  if (!segments.length) {
    segments.push({ type: 'text', value: text });
  }
  return segments;
}

export function ColorHexChip({ hex, label }) {
  if (!hex) return null;
  const light = isLightColor(hex);
  return (
    <span className="color-hex" title={label ? `${label}: ${hex}` : `Color preview: ${hex}`}>
      <span
        className={`color-hex__swatch${light ? ' color-hex__swatch--light' : ''}`}
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <span className="color-hex__code">{hex}</span>
      {label && <span className="color-hex__label">{label}</span>}
    </span>
  );
}

function HexInline({ hex }) {
  return <ColorHexChip hex={hex} />;
}

/**
 * Renders text with inline color swatches beside every #hex code.
 */
export default function ColorHexText({ children, className, as: Tag = 'span' }) {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const segments = useMemo(() => parseSegments(text), [text]);
  const hasHex = segments.some(seg => seg.type === 'hex');

  if (!hasHex) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      {segments.map((seg, i) => (
        seg.type === 'hex'
          ? <HexInline key={`${seg.value}-${i}`} hex={seg.value} />
          : <React.Fragment key={i}>{seg.value}</React.Fragment>
      ))}
    </Tag>
  );
}
