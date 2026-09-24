import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:600]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# --------------------------------------------------------------------
# Root cause: EditableElement's hover badge is positioned at
# `top: -12px; right: -12px` - i.e. deliberately poking OUTSIDE the
# wrapped element's own box, which works fine for a small inline photo
# with room around it, but breaks for a wrap that fills its entire
# parent's box:
#   - Contact - Hero / WhatsApp Banner: the wrap now spans the FULL
#     section (a full-bleed background-image section), so the badge's
#     -12px offset pushes it outside `.editable-section-preview`'s own
#     `overflow: hidden` boundary (that boundary has no padding) - top
#     and right get clipped, exactly as seen in the screenshots.
#   - Contact - Message Form's side photo: the `fill` wrap sits inside
#     `.ctc-form-side-media`, which itself needs `overflow: hidden` on
#     the public site to crop the photo into its blob shape - so the
#     same -12px offset gets clipped there too, and that box is only
#     180x120px, too narrow for the full label text.
#
# Fix: two new, OPT-IN props on EditableElement:
#   - insetBadge: keeps the badge fully inside the wrapped box (positive
#     offset instead of negative) with more generous padding/size and a
#     higher z-index, so it's visible regardless of an ancestor's
#     overflow:hidden.
#   - compactBadge: (only meaningful with insetBadge) drops the
#     section-name label text on a narrow image, keeping just the
#     Edit/Replace/Delete action buttons so they stay fully visible and
#     tappable instead of overflowing a small box.
# Default behavior (every other EditableElement usage across the whole
# site) is completely unchanged - these only activate where explicitly
# passed, which is exactly the 3 Contact Us images below. No public-site
# CSS is touched (editor.css is admin-only, confirmed unreferenced by
# site.css).
# --------------------------------------------------------------------

# 1) EditableElement.jsx - add the two new opt-in props.
apply(f"{ROOT}/src/admin/editor/EditableElement.jsx", [
    (
        "export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, wrapperStyle, children }) {",
        "export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, wrapperStyle, insetBadge = false, compactBadge = false, children }) {",
    ),
    (
        "      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}`}",
        "      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}${insetBadge ? ' editable-badge-inset' : ''}${compactBadge ? ' editable-badge-compact' : ''}`}",
    ),
])

# 2) editor.css - scoped rules for `.editable-badge-inset`, so the badge
# and its buttons stay fully inside the wrapped box, clearly spaced and
# readable, with room to wrap onto a second line on a narrow image
# instead of overflowing; `.editable-badge-compact` additionally drops
# the label text on very narrow images.
apply(f"{ROOT}/src/admin/editor/editor.css", [
    (
        """.editable-element-wrap:hover .editable-element-badge {
  opacity: 1;
}""",
        """.editable-element-wrap:hover .editable-element-badge {
  opacity: 1;
}

/* Opt-in variant (Contact Us hero/background/CTA-area images) - keeps
   the badge fully INSIDE the wrapped box instead of poking outside it,
   so an ancestor's `overflow: hidden` (the admin preview card, or a
   cropped/blob-shaped image container) never clips it. Also sized for
   comfortable click targets and legible text. */
.editable-element-wrap.editable-badge-inset .editable-element-badge {
  top: 10px;
  right: 10px;
  left: 10px;
  z-index: 30;
  padding: 8px 12px;
  font-size: 13px;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  border-radius: 6px;
}

.editable-element-wrap.editable-badge-inset .editable-element-overlay {
  z-index: 20;
}

.editable-element-wrap.editable-badge-inset .editable-element-action {
  padding: 4px 8px;
  border-radius: 4px;
  min-height: 24px;
}

.editable-element-wrap.editable-badge-inset .editable-element-action:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* On a very narrow wrap (e.g. the Message Form's small oval photo) even
   a wrapped 2-line badge is tight - drop the section-name label there
   and keep just the action buttons, which stay fully visible and
   tappable. */
.editable-element-wrap.editable-badge-inset.editable-badge-compact .editable-label {
  display: none;
}

.editable-element-wrap.editable-badge-inset.editable-badge-compact .editable-element-badge {
  gap: 8px;
  padding: 6px 8px;
}"""
    ),
])

print("EditableElement.jsx / editor.css: opt-in insetBadge/compactBadge props added, scoped CSS keeps the hover badge fully visible")


# 3) Contact.jsx - opt in on the 3 real images (the only place these new
# props are used anywhere in the app).
apply(f"{ROOT}/src/pages/Contact.jsx", [
    (
        '<EditableElement sectionKey="contactHero" field="backgroundImage" type="image" label="Hero Background Image" wrapperStyle={{ display: \'block\' }}>',
        '<EditableElement sectionKey="contactHero" field="backgroundImage" type="image" label="Hero Background Image" wrapperStyle={{ display: \'block\' }} insetBadge>',
    ),
    (
        '<EditableElement sectionKey="contactForm" field="sideImage" type="image" label="Side Image" fill>',
        '<EditableElement sectionKey="contactForm" field="sideImage" type="image" label="Side Image" fill insetBadge compactBadge>',
    ),
    (
        '<EditableElement sectionKey="contactWhatsapp" field="backgroundImage" type="image" label="WhatsApp Background Image" wrapperStyle={{ display: \'block\' }}>',
        '<EditableElement sectionKey="contactWhatsapp" field="backgroundImage" type="image" label="WhatsApp Background Image" wrapperStyle={{ display: \'block\' }} insetBadge>',
    ),
])

print("Contact.jsx: insetBadge/compactBadge opted in on all 3 image controls (Hero, Message Form side image, WhatsApp banner)")
