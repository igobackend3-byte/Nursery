// The subtlest layer of the botanical system: a soft warm "sunlight"
// glow behind a section's heading, plus a couple of near-invisible dust
// motes drifting slowly upward. Both are opacity/transform only, low
// enough that they read as atmosphere rather than a visible effect -
// same aria-hidden / pointer-events: none / behind-content rules as
// every other decorative piece here.
function DecorativeGlow({ variant }) {
  return (
    <div className={`decor-glow decor-glow-${variant}`} aria-hidden="true">
      <span className="decor-glow-sun" />
      <span className="decor-glow-dust" />
      <span className="decor-glow-dust" />
    </div>
  );
}

export default DecorativeGlow;
