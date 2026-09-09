// Small pink petals that drift slowly downward through a section's
// whitespace - a distinct motion (slow fall + sway + fade) from the
// existing leaf sway/drift and flower bloom, so it reads as its own kind
// of detail rather than a re-skin. Same rules as every other decorative
// piece: aria-hidden, pointer-events: none, sits behind real content.
function PetalGlyph() {
  return (
    <svg viewBox="0 0 16 20" fill="currentColor">
      <path d="M8 0C11 4 15 8 15 12.5 15 16.6 11.9 20 8 20S1 16.6 1 12.5C1 8 5 4 8 0Z" />
    </svg>
  );
}

function DecorativePetals({ variant, count = 2 }) {
  return (
    <div className={`decor-petals decor-petals-${variant}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="decor-petal" key={i}>
          <PetalGlyph />
        </span>
      ))}
    </div>
  );
}

export default DecorativePetals;
