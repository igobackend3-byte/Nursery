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
# Batch 3: Contact.jsx - wire the page up to the Visual Editor.
#
# All Edit/Replace/Reset/Settings controls are driven purely by
# sectionSchemas.js (see EditableSection.jsx's Quick Actions panel) - no
# inline hover-wraps are needed inside the page content itself for those
# to work. So this batch makes the minimal possible change: wrap each of
# the 6 already-correct sections in <EditableSection sectionKey=... />
# (a bare pass-through outside editor mode - zero visual effect), read
# from the 6 new flat siteContent keys instead of the old nested
# `contactPage`, and rename the two background-image fields to match the
# site-wide `backgroundImage` convention. No className/style/JSX
# structure changes anywhere - layout, alignment, spacing, image ratios,
# typography and responsive behavior are all untouched.
# --------------------------------------------------------------------
apply(f"{ROOT}/src/pages/Contact.jsx", [
    # Import EditableSection (EditableElement is intentionally NOT
    # needed - see note above).
    (
        "import { useState } from 'react';\nimport { useSiteContent } from '../hooks/useSiteContent';",
        "import { useState } from 'react';\nimport { useSiteContent } from '../hooks/useSiteContent';\nimport EditableSection from '../admin/editor/EditableSection';",
    ),
    # ContactHero: data.image -> data.backgroundImage (matches the
    # schema.backgroundImage / Section Settings convention used by every
    # other hero/banner section on the site).
    (
        "function ContactHero({ data }) {\n  return (\n    <section className=\"ctc-hero ctc-hero-image-only\" style={{ backgroundImage: `url(${data.image})` }}>",
        "function ContactHero({ data }) {\n  return (\n    <section className=\"ctc-hero ctc-hero-image-only\" style={{ backgroundImage: `url(${data.backgroundImage})` }}>",
    ),
    # WhatsAppBanner: data.bgImage -> data.backgroundImage (same reason).
    (
        "      className=\"ctc-whatsapp\"\n      style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(${data.bgImage})` }}",
        "      className=\"ctc-whatsapp\"\n      style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(${data.backgroundImage})` }}",
    ),
    # Main Contact() component: read the 6 new flat keys, wrap each
    # rendered section in its own EditableSection, and feed each child
    # component the matching flat data object instead of contactPage.*.
    # The Trust Strip now correctly reads `contactTrust` instead of the
    # old historical-accident reuse of `contactPage.form`.
    (
        """function Contact() {
  const { contactPage } = useSiteContent();

  return (
    <div className="ctc-page">
      <ContactHero data={contactPage.hero} />

      <section className="ctc-body">
        <div className="ctc-info-col">
          <InfoCard icon={Icon.Phone} title={contactPage.infoCards.phoneHeading} subtitle={contactPage.infoCards.phoneSub}>
            <p className="ctc-info-strong">{contactPage.infoCards.phoneText}</p>
            <p className="ctc-info-note">{contactPage.infoCards.phoneHours}</p>
          </InfoCard>
          <InfoCard icon={Icon.Mail} title={contactPage.infoCards.emailHeading} subtitle={contactPage.infoCards.emailSub}>
            <p className="ctc-info-strong">{contactPage.infoCards.emailText}</p>
            <p className="ctc-info-note">{contactPage.infoCards.emailNote}</p>
          </InfoCard>
          <InfoCard icon={Icon.Pin} title={contactPage.infoCards.locHeading} subtitle={contactPage.infoCards.locSub}>
            <p className="ctc-info-note" dangerouslySetInnerHTML={{ __html: contactPage.infoCards.locText }} />
          </InfoCard>
          <InfoCard icon={Icon.Clock} title={contactPage.infoCards.hoursHeading} subtitle={contactPage.infoCards.hoursSub}>
            <p className="ctc-info-note">{contactPage.infoCards.hoursText1}</p>
            <p className="ctc-info-note">{contactPage.infoCards.hoursText2}</p>
          </InfoCard>
        </div>

        <ContactForm data={contactPage.form} />
      </section>

      <TrustInformationStrip data={contactPage.form} />

      <FindOurFarm data={contactPage.farm} />
      <WhatsAppBanner data={contactPage.whatsapp} />
    </div>
  );
}""",
        """function Contact() {
  const { contactHero, contactInfoCards, contactForm, contactTrust, contactFarm, contactWhatsapp } = useSiteContent();

  return (
    <div className="ctc-page">
      <EditableSection sectionKey="contactHero" label="Contact - Hero">
        <ContactHero data={contactHero} />
      </EditableSection>

      <section className="ctc-body">
        <EditableSection sectionKey="contactInfoCards" label="Contact - Info Cards">
          <div className="ctc-info-col">
            <InfoCard icon={Icon.Phone} title={contactInfoCards.phoneHeading} subtitle={contactInfoCards.phoneSub}>
              <p className="ctc-info-strong">{contactInfoCards.phoneText}</p>
              <p className="ctc-info-note">{contactInfoCards.phoneHours}</p>
            </InfoCard>
            <InfoCard icon={Icon.Mail} title={contactInfoCards.emailHeading} subtitle={contactInfoCards.emailSub}>
              <p className="ctc-info-strong">{contactInfoCards.emailText}</p>
              <p className="ctc-info-note">{contactInfoCards.emailNote}</p>
            </InfoCard>
            <InfoCard icon={Icon.Pin} title={contactInfoCards.locHeading} subtitle={contactInfoCards.locSub}>
              <p className="ctc-info-note" dangerouslySetInnerHTML={{ __html: contactInfoCards.locText }} />
            </InfoCard>
            <InfoCard icon={Icon.Clock} title={contactInfoCards.hoursHeading} subtitle={contactInfoCards.hoursSub}>
              <p className="ctc-info-note">{contactInfoCards.hoursText1}</p>
              <p className="ctc-info-note">{contactInfoCards.hoursText2}</p>
            </InfoCard>
          </div>
        </EditableSection>

        <EditableSection sectionKey="contactForm" label="Contact - Message Form">
          <ContactForm data={contactForm} />
        </EditableSection>
      </section>

      <EditableSection sectionKey="contactTrust" label="Contact - Trust Strip">
        <TrustInformationStrip data={contactTrust} />
      </EditableSection>

      <EditableSection sectionKey="contactFarm" label="Contact - Find Our Farm">
        <FindOurFarm data={contactFarm} />
      </EditableSection>
      <EditableSection sectionKey="contactWhatsapp" label="Contact - WhatsApp Banner">
        <WhatsAppBanner data={contactWhatsapp} />
      </EditableSection>
    </div>
  );
}""",
    ),
])

print("Contact.jsx: wired up to Visual Editor (6 EditableSection wraps, flat keys, field renames)")
