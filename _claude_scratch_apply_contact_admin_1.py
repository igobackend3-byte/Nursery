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
# Batch 1: siteContent.js - split the single nested `contactPage` object
# into 6 flat top-level siteContent keys (one per independently
# manageable Contact Us section), matching the same convention already
# used for About/Plants/Seeds/Pots/PlantCare (visible/order/
# backgroundColor/paddingY on every key so Reset/Delete/Settings work).
# All real content values are carried over unchanged. Two field renames
# to match the site-wide background-image convention used by every other
# hero/banner section: hero.image -> contactHero.backgroundImage, and
# whatsapp.bgImage -> contactWhatsapp.backgroundImage. The 3 perk fields
# move out of `form` into their own `contactTrust` key, since the Trust
# Strip is a visually/functionally separate section from the message
# form (this was a historical accident in the old nested shape).
# --------------------------------------------------------------------
OLD_CONTACT_PAGE = """  // Contact Us page - real business info (same phone/email used in the
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
"""

NEW_CONTACT_KEYS = """  // Contact Us page - flat top-level keys (Visual Editor convention: one
  // real siteContent key per independently manageable section, same
  // pattern as About/Plants/Seeds/Pots/PlantCare). All content below is
  // the same real business info already used on the live /contact page
  // (same phone/email as the site footer) - only the shape changed, to
  // make each section independently Edit/Reset/Delete/Settings-able from
  // Admin -> Contact Us.
  contactHero: {
    visible: true,
    order: 1,
    backgroundColor: '',
    paddingY: '',
    backgroundImage: '/images/about-us/18_contact_hero.png',
    headingVisible: true,
    heading: 'Get in Touch',
    descriptionVisible: true,
    description: "Have a question about our plants or services? We'd love to hear from you.",
  },
  contactInfoCards: {
    visible: true,
    order: 2,
    backgroundColor: '',
    paddingY: '',
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
  contactForm: {
    visible: true,
    order: 3,
    backgroundColor: '',
    paddingY: '',
    heading: 'Send Us a Message',
    description: "Fill out the form below and our team will get back to you shortly.",
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    phoneLabel: 'Phone Number',
    messageLabel: 'Message',
    buttonText: 'Send Message',
    sideImage: '/images/about-us/01_hero_nursery_greenhouse.jpg',
  },
  contactTrust: {
    visible: true,
    order: 4,
    backgroundColor: '',
    paddingY: '',
    perk1Heading: 'Quality Guaranteed',
    perk1Text: 'Healthy, hand-picked plants every time.',
    perk2Heading: 'Friendly Support',
    perk2Text: 'Our team is always here to help.',
    perk3Heading: 'Trusted by Thousands',
    perk3Text: 'Loved by plant parents across India.',
  },
  contactFarm: {
    visible: true,
    order: 5,
    backgroundColor: '',
    paddingY: '',
    heading: 'Find Our Farm',
    description: 'Visit our nursery and see where your plants are grown, cared for and readied for delivery.',
    buttonText: 'Get Directions',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Muttukadu+Chennai',
    mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=80.22%2C12.79%2C80.28%2C12.85&layer=mapnik&marker=12.82%2C80.25',
    mapLabel: 'IGO Nursery — Muttukadu Lab & Store',
  },
  contactWhatsapp: {
    visible: true,
    order: 6,
    backgroundColor: '',
    paddingY: '',
    backgroundImage: '/images/about-us/15_journey_greenhouse.jpg',
    heading: 'Chat With Us on WhatsApp',
    description: 'Get quick answers to your plant questions, straight from our team.',
    number: '919876543210',
    buttonText: 'Start Chat',
  },
"""

apply(f"{ROOT}/src/data/siteContent.js", [
    (OLD_CONTACT_PAGE, NEW_CONTACT_KEYS),
])

print("siteContent.js: contactPage split into 6 flat contactX keys")
