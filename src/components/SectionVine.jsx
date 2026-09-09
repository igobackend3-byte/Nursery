import { LeafGlyphSmall } from './DecorativeLeaves';

// A small decorative vine in one corner of a section - purely ambient,
// sits behind content (see .section-vine in nature-decor.css) and never
// overlaps text/cards/buttons. Draws itself in (stroke-dashoffset) once,
// the first time the host section becomes visible; `active` is passed in
// directly from the section's own reveal state so this works regardless
// of which class name that section already uses for it (reveal-section's
// `is-visible`, `os-band-visible`, etc.) - no new IntersectionObserver.
function SectionVine({ variant, active }) {
  return (
    <svg
      className={`section-vine section-vine-${variant}${active ? ' is-active' : ''}`}
      viewBox="0 0 160 160"
      aria-hidden="true"
    >
      <path d="M6 154 C 34 118, 18 78, 52 46 S 108 18, 138 26" />
      <g className="vine-leaf" transform="translate(40,92)"><LeafGlyphSmall /></g>
      <g className="vine-leaf" transform="translate(96,38) scale(0.82)"><LeafGlyphSmall /></g>
    </svg>
  );
}

export default SectionVine;
