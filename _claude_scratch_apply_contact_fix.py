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


# Pre-existing bug (unrelated to the Plants work): src/pages/Contact.jsx
# reads `contactPage.hero` / `.infoCards` / `.form` / `.farm` / `.whatsapp`
# from useSiteContent(), but `contactPage` was never added to
# DEFAULT_SITE_CONTENT - so `contactPage` is undefined and the very first
# line of Contact() throws "Cannot read properties of undefined (reading
# 'hero')", crashing the whole page to a blank screen (same failure class
# as the earlier /plants bug, just a missing content block instead of a
# missing import). Real business phone/email/address (same ones already
# used in the site footer) and the page's own already-defined but
# previously-orphaned MAP_EMBED_SRC constant are used as the defaults.
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  // About - Hero - flat top-level key (Visual Editor convention: one real
  // siteContent key per independently manageable section).
  aboutHero: {""",
"""  // Contact Us page - real business info (same phone/email used in the
  // site footer; address/hours are reasonable defaults, editable later).
  // mapUrl reuses the OpenStreetMap embed URL Contact.jsx already had
  // defined locally (MAP_EMBED_SRC) but never wired up.
  contactPage: {
    hero: {
      image: '/images/about-us/18_contact_hero.png',
      heading: 'Get in Touch',
      description: "Have a question about our plants or services? We'd love to hear from you.",
    },
    infoCards: {
      phoneHeading: 'Call Us',
      phoneSub: "We're happy to help",
      phoneText: '+91 98765 43210',
      phoneHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
      emailHeading: 'Email Us',
      emailSub: "We'll respond within 24 hours",
      emailText: 'support@igoagritechfarms.com',
      emailNote: 'For orders, support and enquiries',
      locHeading: 'Visit Us',
      locSub: 'Come see our nursery',
      locText: '123 Green Valley Road,<br />Coimbatore, Tamil Nadu – 641XXX',
      hoursHeading: 'Working Hours',
      hoursSub: "We're open",
      hoursText1: 'Mon - Sat: 9:00 AM - 6:00 PM',
      hoursText2: 'Sunday: Closed',
    },
    form: {
      heading: 'Send Us a Message',
      description: "Fill out the form below and our team will get back to you shortly.",
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone Number',
      messageLabel: 'Message',
      buttonText: 'Send Message',
      sideImage: '/images/about-us/01_hero_nursery_greenhouse.jpg',
      perk1Heading: 'Quality Guaranteed',
      perk1Text: 'Healthy, hand-picked plants every time.',
      perk2Heading: 'Friendly Support',
      perk2Text: 'Our team is always here to help.',
      perk3Heading: 'Trusted by Thousands',
      perk3Text: 'Loved by plant parents across India.',
    },
    farm: {
      heading: 'Find Our Farm',
      description: 'Visit our nursery and see where your plants are grown, cared for and readied for delivery.',
      buttonText: 'Get Directions',
      directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Muttukadu+Chennai',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=80.22%2C12.79%2C80.28%2C12.85&layer=mapnik&marker=12.82%2C80.25',
      mapLabel: 'IGO Nursery — Muttukadu Lab & Store',
    },
    whatsapp: {
      bgImage: '/images/about-us/15_journey_greenhouse.jpg',
      heading: 'Chat With Us on WhatsApp',
      description: 'Get quick answers to your plant questions, straight from our team.',
      number: '919876543210',
      buttonText: 'Start Chat',
    },
  },
  // About - Hero - flat top-level key (Visual Editor convention: one real
  // siteContent key per independently manageable section).
  aboutHero: {"""
),
])

print("Contact page default content added - blank /contact page fixed")
