import { LeafGlyphSmall } from './DecorativeLeaves';

// A taller vine that hangs down from a section's top corner (as opposed
// to SectionVine's small corner curl) - same stroke-draw-in technique,
// `active` passed in directly so it works under any section's own
// visibility class. `side` mirrors it for the right corner.
function HangingVine({ variant, side = 'left', active }) {
  return (
    <svg
      className={`hanging-vine hanging-vine-${variant} hanging-vine-${side}${active ? ' is-active' : ''}`}
      viewBox="0 0 90 220"
      aria-hidden="true"
      style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M45 0 C 30 40, 60 70, 38 110 S 55 170, 30 210" />
      <g className="vine-leaf" transform="translate(38,55)"><LeafGlyphSmall /></g>
      <g className="vine-leaf" transform="translate(30,120) scale(0.85)"><LeafGlyphSmall /></g>
      <g className="vine-leaf" transform="translate(48,175) scale(0.75)"><LeafGlyphSmall /></g>
    </svg>
  );
}

export default HangingVine;
