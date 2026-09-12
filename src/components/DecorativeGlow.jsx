// Decorative floating "dust" dots and pulsing glow circles have been
// removed site-wide per request (no moving circular/particle effects).
// The component is kept as a no-op so every call site needs no changes.
function DecorativeGlow() {
  return null;
}

export default DecorativeGlow;
