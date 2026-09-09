// Purely decorative, ambient butterflies that drift across the homepage on
// slow curved flight paths (CSS `offset-path`, not a JS animation loop) -
// small, muted, garden-toned, never interactive. Sits in a single
// fixed, full-viewport, pointer-events:none layer (see butterflies.css)
// well below the header/nav's z-index, so it can visually cross section
// boundaries the way a real butterfly would without ever intercepting a
// click or covering the nav.
function Wing({ side }) {
  const d = side === 'left'
    ? 'M19 15 C 8 2, -2 4, 2 14 C -1 22, 10 26, 19 17 Z'
    : 'M21 15 C 32 2, 42 4, 38 14 C 41 22, 30 26, 21 17 Z';
  return (
    <g className={`butterfly-wing butterfly-wing-${side}`}>
      <path d={d} />
    </g>
  );
}

function ButterflyGlyph() {
  return (
    <svg viewBox="0 0 40 30" className="butterfly-svg">
      <Wing side="left" />
      <Wing side="right" />
      <ellipse cx="20" cy="15" rx="1.3" ry="8.5" className="butterfly-body" />
    </svg>
  );
}

// Each entry: a distinct flight-path class (own bezier curve in
// butterflies.css), duration, start delay and tone - so no two
// butterflies move together, at the same speed, or in the same colour.
// Tones are soft/muted pastels (never neon) so the extra colour still
// reads as premium rather than cartoonish.
const BUTTERFLIES = [
  { id: 1, pathClass: 'butterfly-path-1', duration: 27, delay: 0, tone: 'sage' },
  { id: 2, pathClass: 'butterfly-path-2', duration: 34, delay: 9, tone: 'pink' },
  { id: 3, pathClass: 'butterfly-path-3', duration: 30, delay: 17, tone: 'moss' },
  { id: 4, pathClass: 'butterfly-path-4', duration: 38, delay: 4, tone: 'yellow' },
  { id: 5, pathClass: 'butterfly-path-5', duration: 31, delay: 22, tone: 'blue' },
  { id: 6, pathClass: 'butterfly-path-6', duration: 36, delay: 12, tone: 'orange' },
  { id: 7, pathClass: 'butterfly-path-7', duration: 29, delay: 27, tone: 'cream' },
];

function Butterflies({ count = 3 }) {
  const active = BUTTERFLIES.slice(0, count);
  return (
    <div className="butterfly-field" aria-hidden="true">
      {active.map((b) => (
        <div
          key={b.id}
          className={`butterfly ${b.pathClass} butterfly-tone-${b.tone}`}
          style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        >
          <ButterflyGlyph />
        </div>
      ))}
    </div>
  );
}

export default Butterflies;
