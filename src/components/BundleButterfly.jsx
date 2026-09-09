// A single small butterfly perched on the edge of a "BUILD YOUR OWN
// BUNDLE" badge - position is fixed (CSS `position: absolute`, no
// translateX/Y, no flight path, no bob). The ONLY thing that moves is
// the wings, via a slow open/close cycle - see bundle-butterfly.css.
// Distinct from (and replaces, on the badge) the old free-flying
// Butterflies component, which has been removed from every page.
function BundlePerchedWing({ side }) {
  const d = side === 'left'
    ? 'M10 8 C 4 1, -1 2, 1 7 C -1 12, 5 14, 10 9 Z'
    : 'M12 8 C 18 1, 23 2, 21 7 C 23 12, 17 14, 12 9 Z';
  return (
    <g className={`bundle-butterfly-wing bundle-butterfly-wing-${side}`}>
      <path d={d} />
    </g>
  );
}

function BundleButterfly({ tone = 'orange', delay = 0 }) {
  return (
    <span
      className={`bundle-butterfly bundle-butterfly-${tone}`}
      style={{ '--flap-delay': `${delay}s` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 22 16" className="bundle-butterfly-svg">
        <BundlePerchedWing side="left" />
        <BundlePerchedWing side="right" />
        <ellipse cx="11" cy="8" rx="0.9" ry="5.2" className="bundle-butterfly-body" />
      </svg>
    </span>
  );
}

export default BundleButterfly;
