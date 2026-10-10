// Stable per-case order so answer position never gives the game away.
export function shuffled(list, seedText) {
  const out = [...list];
  let seed = [...seedText].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  for (let i = out.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
