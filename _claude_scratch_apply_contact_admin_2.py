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
# Batch 2: sectionSchemas.js - add the 6 new contactX schema entries.
# Every "Edit"/"Replace"/"Reset"/"Settings" quick-action button in the
# Admin sidebar is driven purely by this schema data (see
# EditableSection.jsx's Quick Actions panel) - no inline JSX wraps are
# required in Contact.jsx for these controls to work.
# --------------------------------------------------------------------
ANCHOR = "  aboutHero: {"

NEW_SCHEMAS = """  contactHero: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'heading',
        label: 'Heading',
        fields: [
          { field: 'heading', label: 'Heading Text' },
          { field: 'headingVisible', label: 'Show heading', type: 'checkbox' },
        ],
      },
      {
        key: 'description',
        label: 'Description',
        fields: [
          { field: 'description', label: 'Description Text' },
          { field: 'descriptionVisible', label: 'Show description', type: 'checkbox' },
        ],
      },
    ],
    settings: true,
    reset: true,
  },
  contactInfoCards: {
    fieldGroups: [
      {
        key: 'phone',
        label: 'Phone Card',
        fields: [
          { field: 'phoneHeading', label: 'Heading' },
          { field: 'phoneSub', label: 'Subheading' },
          { field: 'phoneText', label: 'Phone Number' },
          { field: 'phoneHours', label: 'Hours Line' },
        ],
      },
      {
        key: 'email',
        label: 'Email Card',
        fields: [
          { field: 'emailHeading', label: 'Heading' },
          { field: 'emailSub', label: 'Subheading' },
          { field: 'emailText', label: 'Email Address' },
          { field: 'emailNote', label: 'Note' },
        ],
      },
      {
        key: 'location',
        label: 'Location Card',
        fields: [
          { field: 'locHeading', label: 'Heading' },
          { field: 'locSub', label: 'Subheading' },
          { field: 'locText', label: 'Address (HTML <br /> allowed for line breaks)' },
        ],
      },
      {
        key: 'hours',
        label: 'Business Hours Card',
        fields: [
          { field: 'hoursHeading', label: 'Heading' },
          { field: 'hoursSub', label: 'Subheading' },
          { field: 'hoursText1', label: 'Line 1' },
          { field: 'hoursText2', label: 'Line 2' },
        ],
      },
    ],
    settings: true,
    reset: true,
  },
  contactForm: {
    images: [{ field: 'sideImage', label: 'Side Image' }],
    fieldGroups: [
      {
        key: 'header',
        label: 'Form Heading',
        fields: [
          { field: 'heading', label: 'Heading' },
          { field: 'description', label: 'Description' },
        ],
      },
      {
        key: 'labels',
        label: 'Field Labels',
        fields: [
          { field: 'nameLabel', label: 'Name Field Label' },
          { field: 'emailLabel', label: 'Email Field Label' },
          { field: 'phoneLabel', label: 'Phone Field Label' },
          { field: 'messageLabel', label: 'Message Field Label' },
        ],
      },
    ],
    button: {
      label: 'Submit Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
      ],
    },
    settings: true,
    reset: true,
  },
  contactTrust: {
    fieldGroups: [
      {
        key: 'perk1',
        label: 'Perk 1 (Quality Guaranteed)',
        fields: [
          { field: 'perk1Heading', label: 'Heading' },
          { field: 'perk1Text', label: 'Text' },
        ],
      },
      {
        key: 'perk2',
        label: 'Perk 2 (Friendly Support)',
        fields: [
          { field: 'perk2Heading', label: 'Heading' },
          { field: 'perk2Text', label: 'Text' },
        ],
      },
      {
        key: 'perk3',
        label: 'Perk 3 (Trusted by Thousands)',
        fields: [
          { field: 'perk3Heading', label: 'Heading' },
          { field: 'perk3Text', label: 'Text' },
        ],
      },
    ],
    settings: true,
    reset: true,
  },
  contactFarm: {
    fieldGroups: [
      {
        key: 'heading',
        label: 'Heading & Description',
        fields: [
          { field: 'heading', label: 'Heading' },
          { field: 'description', label: 'Description' },
        ],
      },
      {
        key: 'map',
        label: 'Map',
        fields: [
          { field: 'mapUrl', label: 'Map Embed URL' },
          { field: 'mapLabel', label: 'Map Label' },
        ],
      },
    ],
    button: {
      label: 'Get Directions Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'directionsUrl', label: 'Directions URL' },
      ],
    },
    settings: true,
    reset: true,
  },
  contactWhatsapp: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'heading',
        label: 'Heading & Description',
        fields: [
          { field: 'heading', label: 'Heading' },
          { field: 'description', label: 'Description' },
        ],
      },
      {
        key: 'number',
        label: 'WhatsApp Number',
        fields: [
          { field: 'number', label: 'Number (digits only, country code first)' },
        ],
      },
    ],
    button: {
      label: 'Chat Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
      ],
    },
    settings: true,
    reset: true,
  },
""" + ANCHOR

apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
    (ANCHOR, NEW_SCHEMAS),
])

print("sectionSchemas.js: 6 contactX schema entries added")
