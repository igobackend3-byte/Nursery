// A small, ambient botanical flower accent - same purpose and rules as
// DecorativeLeaves (whitespace only, aria-hidden, pointer-events: none,
// z-index: -1 behind real content), but a distinct glyph and motion
// ("bloom" - a gentle open-and-settle instead of a sway) so it reads as
// its own kind of decoration rather than a re-skinned leaf.
function FlowerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2.6" className="flower-center" />
      <g className="flower-petals">
        <circle cx="12" cy="5.5" r="3.1" />
        <circle cx="18.2" cy="9" r="3.1" />
        <circle cx="15.8" cy="16.3" r="3.1" />
        <circle cx="8.2" cy="16.3" r="3.1" />
        <circle cx="5.8" cy="9" r="3.1" />
      </g>
    </svg>
  );
}

function DecorativeFlowers({ variant, count = 2 }) {
  return (
    <div className={`decor-flowers decor-flowers-${variant}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="decor-flower" key={i}>
          <FlowerGlyph />
        </span>
      ))}
    </div>
  );
}

export default DecorativeFlowers;
