// Purely decorative, ambient leaf accents dropped into the whitespace of a
// few homepage sections (never over text/products/buttons). Every instance
// renders the same small leaf glyph already used elsewhere on the site
// (Footer/Offers leaf icon) - positioning, size, timing and motion style
// for each leaf all come from CSS (`.decor-leaves-<variant> .decor-leaf:
// nth-child(n)`), keyed off `variant` + index, so this component itself
// stays a thin, reusable wrapper. aria-hidden + pointer-events:none, so it
// never affects layout, a11y tree or interaction.
function LeafGlyphSmall() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

function DecorativeLeaves({ variant, count = 3 }) {
  return (
    <div className={`decor-leaves decor-leaves-${variant}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="decor-leaf" key={i}>
          <LeafGlyphSmall />
        </span>
      ))}
    </div>
  );
}

export default DecorativeLeaves;
