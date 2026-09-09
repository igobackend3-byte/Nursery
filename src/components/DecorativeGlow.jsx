// The subtlest layer of the botanical system: a soft warm "sunlight"
// glow behind a section's heading, plus a couple of near-invisible dust
// motes drifting slowly upward. Both are opacity/transform only, low
// enough that they read as atmosphere rather than a visible effect -
// same aria-hidden / pointer-events: none / behind-content rules as
// every other decorative piece here.
function DecorativeGlow({ variant }) {
  if (variant === 'global') {
    return (
      <div className="decor-glow decor-glow-global" aria-hidden="true">
        <div className="decor-glow-sun decor-glow-sun-left"></div>
        <div className="decor-glow-sun decor-glow-sun-right"></div>
        <div className="decor-glow-dust"></div>
        <div className="decor-glow-dust"></div>
        <div className="decor-glow-dust"></div>
        <div className="decor-glow-dust"></div>
        <div className="decor-glow-dust"></div>
      </div>
    );
  }

  return (
    <div className={`decor-glow decor-glow-${variant}`} aria-hidden="true">
      <div className="decor-glow-sun"></div>
      <div className="decor-glow-dust"></div>
      <div className="decor-glow-dust"></div>
      <div className="decor-glow-dust"></div>
    </div>
  );
}

export default DecorativeGlow;
