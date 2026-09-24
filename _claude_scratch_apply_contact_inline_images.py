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
# Add inline, hover-based image controls (Edit/Replace/Delete/Reset to
# Default) DIRECTLY on every image in the Contact Us page - not only via
# the sidebar Quick Actions panel. Uses EditableElement (already used
# this way across About.jsx), which is a complete no-op outside editor
# mode (renders `<>{children}</>`), so the public /contact page is
# unaffected. There are exactly 3 real images on this page: the Hero's
# CSS background photo, the message form's side photo (<img>), and the
# WhatsApp banner's CSS background photo.
# --------------------------------------------------------------------
apply(f"{ROOT}/src/pages/Contact.jsx", [
    # Import EditableElement alongside the already-imported EditableSection.
    (
        "import EditableSection from '../admin/editor/EditableSection';",
        "import EditableSection from '../admin/editor/EditableSection';\nimport EditableElement from '../admin/editor/EditableElement';",
    ),
    # Hero: wrap the whole section (the background photo IS the section)
    # so hovering the hero image itself shows Replace/Delete, with Reset
    # to Default available inside the Replace modal (Use Default button).
    (
        """function ContactHero({ data }) {
  return (
    <section className="ctc-hero ctc-hero-image-only" style={{ backgroundImage: `url(${data.backgroundImage})` }}>
      <div className="ctc-hero-copy ctc-sr-only">
        <h1>{data.heading}</h1>
        <p>{data.description}</p>
      </div>
    </section>
  );
}""",
        """function ContactHero({ data }) {
  return (
    <EditableElement sectionKey="contactHero" field="backgroundImage" type="image" label="Hero Background Image" wrapperStyle={{ display: 'block' }}>
      <section className="ctc-hero ctc-hero-image-only" style={{ backgroundImage: `url(${data.backgroundImage})` }}>
        <div className="ctc-hero-copy ctc-sr-only">
          <h1>{data.heading}</h1>
          <p>{data.description}</p>
        </div>
      </section>
    </EditableElement>
  );
}""",
    ),
    # Message form's side photo: a real <img>, wrapped with `fill` (same
    # pattern as About.jsx's circular photos) so the hover control sits
    # exactly over the existing oval-cropped image without changing its
    # size/position - `.ctc-form-side-media` gets `position: relative`
    # in site.css (see next file) so the fill wrapper sizes against it.
    (
        """        <div className="ctc-form-side-media">
          <img src={data.sideImage} alt="Contact Form Side" loading="lazy" />
        </div>""",
        """        <div className="ctc-form-side-media">
          <EditableElement sectionKey="contactForm" field="sideImage" type="image" label="Side Image" fill>
            <img src={data.sideImage} alt="Contact Form Side" loading="lazy" />
          </EditableElement>
        </div>""",
    ),
    # WhatsApp banner: same whole-section wrap approach as the Hero.
    (
        """function WhatsAppBanner({ data }) {
  return (
    <section
      className="ctc-whatsapp"
      style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(${data.backgroundImage})` }}
    >""",
        """function WhatsAppBanner({ data }) {
  return (
    <EditableElement sectionKey="contactWhatsapp" field="backgroundImage" type="image" label="WhatsApp Background Image" wrapperStyle={{ display: 'block' }}>
    <section
      className="ctc-whatsapp"
      style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(${data.backgroundImage})` }}
    >""",
    ),
    (
        """      </a>
    </section>
  );
}

function Contact() {""",
        """      </a>
    </section>
    </EditableElement>
  );
}

function Contact() {""",
    ),
])

print("Contact.jsx: inline hover Edit/Replace/Delete image controls added (hero bg, form side image, whatsapp bg)")

# .ctc-form-side-media needs `position: relative` so the `fill` wrapper
# (position:absolute; inset:0, editor-mode only) sizes correctly against
# it instead of against some further-up positioned ancestor - a pure
# positioning-context declaration with zero visible effect on the public
# page (no other content in that box is absolutely positioned).
apply(f"{ROOT}/src/styles/site.css", [
    (
        """.ctc-form-side-media {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 50% 50% 20% 50% / 55% 55% 45% 45%;
  overflow: hidden;
}""",
        """.ctc-form-side-media {
  position: relative;
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 50% 50% 20% 50% / 55% 55% 45% 45%;
  overflow: hidden;
}""",
    ),
])

print("site.css: .ctc-form-side-media given position:relative (no visual change) for the fill wrapper")
