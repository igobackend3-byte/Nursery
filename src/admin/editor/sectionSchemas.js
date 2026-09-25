// Describes what content actually exists in each Home Page section, so the
// Visual Editor can (a) show only Quick Actions that apply to real content,
// and (b) drive the generic "Manage Cards" / card editor / "Edit Text"
// modals without hardcoding a form per section.
//
// Shapes:
//   text:   [{ field, label }]            top-level scalar fields -> "Edit Text"
//   images: [{ field, label }]            top-level image fields -> one
//                                          "Replace <label>" action each
//   video:  { field, label }              top-level video field -> "Replace Video"
//   cards:  { field, label, itemLabel, itemTitleFields, itemFields }
//           - field: the array field on the section (e.g. "items", "cards")
//           - itemLabel: singular name used in "+ Add <itemLabel>" / dialogs
//           - itemTitleFields: field names tried, in order, to label a card
//             in the "Manage <label>" list (falls back to "Card N")
//           - itemFields: [{ field, label, type }] rendered in the card editor.
//             type: 'text' | 'textarea' | 'image' | 'select'
//   settings: true   -> always-available Section Settings (visibility/layout)
//   reset:    true   -> always-available Reset to Default (this section only)
// Icon choices for Shop by Category tiles - matches CAT_ICON_MAP's keys
// in src/pages/Home.jsx (kept as plain strings here to avoid importing
// the page component into the schema module).
export const CAT_ICON_FIELD_OPTIONS = [
  'pottedPlant', 'tree', 'flower', 'fruit', 'vegetable', 'seed', 'pot',
  'wateringCan', 'landscape', 'decor', 'box', 'gift', 'care', 'tools',
  'support', 'stones', 'bulb',
];

// Matches the keys of the `Icon` object defined in src/pages/About.jsx -
// kept as plain strings here (same reasoning as CAT_ICON_FIELD_OPTIONS
// above) so this schema module never has to import a page component.
export const ABOUT_ICON_OPTIONS = [
  'Leaf', 'Pot', 'Sprout', 'Users', 'Eye', 'Target', 'Watering',
  'Landscape', 'Gift', 'Diamond', 'Recycle', 'Shield', 'Person', 'Truck', 'Arrow',
];

export const SECTION_SCHEMAS = {
  hero: {
    video: { field: 'videoUrl', label: 'Hero Video' },
    text: [
      { field: 'tag', label: 'Badge Text' },
      { field: 'titleLine1', label: 'Title Line 1' },
      { field: 'titleLine2', label: 'Title Line 2' },
      { field: 'description', label: 'Description' },
      { field: 'primaryButtonText', label: 'Primary Button Text' },
      { field: 'secondaryButtonText', label: 'Secondary Button Text' },
      { field: 'secondaryButtonLink', label: 'Secondary Button Link' },
    ],
    settings: true,
    reset: true,
  },
  ourStory: {
    images: [{ field: 'backgroundImage', label: 'Background Image' }],
    text: [
      { field: 'smallHeading', label: 'Small Heading' },
      { field: 'mainHeadingPart1', label: 'Main Heading (Part 1)' },
      { field: 'mainHeadingPart2', label: 'Main Heading (Part 2)' },
      { field: 'description', label: 'Description' },
      { field: 'buttonText', label: 'Button Text' },
      { field: 'buttonUrl', label: 'Button Link' },
    ],
    settings: true,
    reset: true,
  },
  offers: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle' },
    ],
    cards: {
      field: 'items',
      label: 'Offer Cards',
      itemLabel: 'Offer',
      itemTitleFields: ['note'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'qty', label: 'Quantity', type: 'text' },
        { field: 'price', label: 'Price', type: 'text' },
        { field: 'note', label: 'Note / Subtitle', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },
  statsStrip: {
    cards: {
      field: 'items',
      label: 'Statistics',
      itemLabel: 'Statistic',
      itemTitleFields: ['title', 'value'],
      itemFields: [
        { field: 'value', label: 'Value (e.g. 1L+)', type: 'text' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'subtitle', label: 'Subtitle', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ['users', 'pottedPlant', 'badgeStar', 'package', 'pin'] },
      ],
    },
    settings: true,
    reset: true,
  },
  shopByCategory: {
    text: [
      { field: 'title', label: 'Title' },
      { field: 'subtitle', label: 'Subtitle' },
    ],
    cards: {
      field: 'tiles',
      label: 'Categories',
      itemLabel: 'Category',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'exploreText', label: 'Explore Text (optional)', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: CAT_ICON_FIELD_OPTIONS },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  homeCorners: {
    images: [{ field: 'backgroundImage', label: 'Background Image' }],
    text: [
      { field: 'title', label: 'Title' },
      { field: 'subtitle', label: 'Subtitle' },
    ],
    cards: {
      field: 'cards',
      label: 'Corner Cards',
      itemLabel: 'Corner',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'buttonText', label: 'Button Text', type: 'text' },
        { field: 'buttonLink', label: 'Button Link', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },
  plantsPeopleLove: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'seeAllText', label: 'See All Link Text' },
      { field: 'seeAllLink', label: 'See All Link URL' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  justIn: {
    text: [
      { field: 'title', label: 'Title' },
      { field: 'subtitle', label: 'Subtitle' },
      { field: 'viewAllText', label: 'View All Link Text' },
      { field: 'viewAllLink', label: 'View All Link URL' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  gardenServices: {
    images: [
      { field: 'ctaBackgroundImage', label: 'CTA Background Image (optional)' }
    ],
    text: [
      { field: 'badgeText', label: 'Badge Text' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
      { field: 'ctaLabel', label: 'CTA Label' },
      { field: 'ctaHeading', label: 'CTA Heading' },
      { field: 'ctaDescription', label: 'CTA Description' },
      { field: 'ctaButtonText', label: 'CTA Button Text' },
      { field: 'ctaButtonLink', label: 'CTA Button Link' },
      { field: 'ctaBackgroundColor', label: 'CTA Background Color (e.g. #f4f6f4)' },
    ],
    cards: {
      field: 'items',
      label: 'Service Cards',
      itemLabel: 'Service',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'buttonText', label: 'Button Text', type: 'text' },
        { field: 'buttonLink', label: 'Button Link', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },
  landscaping: {
    images: [
      { field: 'ctaBackgroundImage', label: 'CTA Background Image (optional)' }
    ],
    text: [
      { field: 'badgeText', label: 'Badge Text' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
      { field: 'ctaLabel', label: 'CTA Label' },
      { field: 'ctaHeading', label: 'CTA Heading' },
      { field: 'ctaDescription', label: 'CTA Description' },
      { field: 'ctaButtonText', label: 'CTA Button Text' },
      { field: 'ctaButtonLink', label: 'CTA Button Link' },
      { field: 'ctaBackgroundColor', label: 'CTA Background Color' },
    ],
    cards: {
      field: 'items',
      label: 'Landscaping Cards',
      itemLabel: 'Landscaping',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'buttonText', label: 'Button Text', type: 'text' },
        { field: 'buttonLink', label: 'Button Link', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },
  gifting: {
    text: [
      { field: 'pageTitle', label: 'Page Title' },
      { field: 'subtitle', label: 'Subtitle' }
    ],
    cards: {
      field: 'items',
      label: 'Products',
      itemLabel: 'Product',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'category', label: 'Category', type: 'text' },
        { field: 'price', label: 'Price (₹)', type: 'number' },
        { field: 'oldPrice', label: 'Old Price (₹)', type: 'number' },
        { field: 'discount', label: 'Discount Tag (e.g. 18% OFF)', type: 'text' },
        { field: 'rating', label: 'Rating (e.g. 4.5)', type: 'number' },
        { field: 'badge', label: 'Badge (e.g. BESTSELLER)', type: 'text' },
      ],
    },
    settings: false,
    reset: true,
  },
  corporateGifting: {
    text: [
      { field: 'pageTitle', label: 'Page Title' },
      { field: 'subtitle', label: 'Subtitle' }
    ],
    cards: {
      field: 'items',
      label: 'Products',
      itemLabel: 'Product',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'category', label: 'Category', type: 'text' },
        { field: 'price', label: 'Price (₹)', type: 'number' },
        { field: 'oldPrice', label: 'Old Price (₹)', type: 'number' },
        { field: 'discount', label: 'Discount Tag (e.g. 18% OFF)', type: 'text' },
        { field: 'rating', label: 'Rating (e.g. 4.5)', type: 'number' },
        { field: 'badge', label: 'Badge (e.g. BESTSELLER)', type: 'text' },
      ],
    },
    settings: false,
    reset: true,
  },
  completeGarden: {
    video: { field: 'videoUrl', label: 'Section Video' },
    text: [
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
      { field: 'buttonText', label: 'Button Text' },
      { field: 'buttonUrl', label: 'Button Link' },
    ],
    cards: {
      field: 'pills',
      label: 'Pills',
      itemLabel: 'Pill',
      itemTitleFields: ['text'],
      itemFields: [
        { field: 'icon', label: 'Emoji Icon', type: 'text' },
        { field: 'text', label: 'Text', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },
  gardenServices: {
    text: [
      { field: 'badgeText', label: 'Badge Text' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
    ],
    cards: {
      field: 'items',
      label: 'Services',
      itemLabel: 'Service',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'buttonText', label: 'Button Text', type: 'text' },
        { field: 'buttonLink', label: 'Button Link', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  nurseryJourney: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle' },
    ],
    cards: {
      field: 'steps',
      label: 'Journey Steps',
      itemLabel: 'Step',
      itemTitleFields: ['title'],
      // No "Step Number" field here on purpose - the 01/02/03/04 badge is
      // computed live from the step's position in the list (see
      // NurseryJourney() in Home.jsx), so a stored number would just go
      // stale the moment steps are reordered or one is deleted. Reordering
      // is done via Display Order below, same as every other card section.
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'icon', label: 'Icon', type: 'select', options: ['sprout', 'qualityCheck', 'prepared', 'homeReady'] },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  whyIgo: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'buttonText', label: 'Button Text' },
      { field: 'buttonUrl', label: 'Button Link' },
    ],
    cards: {
      field: 'cards',
      label: 'Feature Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'stat', label: 'Stat (e.g. 99.2%, optional)', type: 'text' },
        { field: 'badgeEnabled', label: 'Show Badge (e.g. VERIFIED)', type: 'checkbox' },
        { field: 'badgeText', label: 'Badge Text', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  ourStoryBand: {
    images: [{ field: 'founderImage', label: 'Founder Image' }],
    text: [
      { field: 'badgeText', label: 'Badge Text' },
      { field: 'heading', label: 'Heading' },
      { field: 'taglinePlain', label: 'Tagline (Plain)' },
      { field: 'taglineHighlight', label: 'Tagline (Highlight)' },
      { field: 'founderName', label: 'Founder Name' },
      { field: 'founderDesignation', label: 'Founder Designation' },
    ],
    cards: {
      field: 'paragraphs',
      label: 'Story Paragraphs',
      itemLabel: 'Paragraph',
      itemTitleFields: ['before'],
      itemFields: [
        { field: 'before', label: 'Text (before highlight)', type: 'textarea' },
        { field: 'strong', label: 'Highlighted Text (optional)', type: 'text' },
        { field: 'after', label: 'Text (after highlight)', type: 'textarea' },
      ],
    },
    settings: true,
    reset: true,
  },
  comparisonSection: {
    images: [
      { field: 'backgroundImage', label: 'Background Image' },
      { field: 'igoHeaderImage', label: 'IGO Header Image' },
    ],
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'headingHighlight', label: 'Highlighted Text' },
      { field: 'subtitle', label: 'Subtitle' },
      { field: 'localTitle', label: 'Local Nurseries Column Title' },
      { field: 'othersTitle', label: 'Others (Online) Column Title' },
      { field: 'igoTitle', label: 'IGO Column Title' },
      { field: 'igoSubtitle', label: 'IGO Column Subtitle' },
      { field: 'badgeText', label: 'Badge Text (e.g. BEST CHOICE)' },
    ],
    cards: {
      field: 'rows',
      label: 'Comparison Rows',
      itemLabel: 'Row',
      itemTitleFields: ['criterion'],
      itemFields: [
        { field: 'criterion', label: 'Feature Name', type: 'text' },
        { field: 'local', label: 'Local Nurseries', type: 'text' },
        { field: 'igo', label: 'IGO Nursery', type: 'text' },
        { field: 'igoHighlight', label: 'Highlighted Word (in IGO Nursery text, optional)', type: 'text' },
        { field: 'others', label: 'Others (Online)', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ['leaf', 'pest', 'repot', 'soil', 'growing', 'health', 'packaging', 'support'] },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  trustBenefits: {
    cards: {
      field: 'items',
      label: 'Trust Benefits',
      itemLabel: 'Benefit',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ['shield', 'sprout', 'truck', 'headset'] },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  plantFinder: {
    // No standalone "Replace Background Image" quick action - this section
    // uses a solid color by default. Background image is offered as a
    // Solid/Image choice inside Section Settings instead (see
    // `backgroundImage` below, read by EditableSection/InlineEditorModal).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
    ],
    // Rendered as its own "Edit Button" Quick Action (see EditableSection.jsx)
    // rather than folded into schema.text, since the CTA has its own
    // link/new-tab/visibility fields distinct from plain section copy.
    button: {
      label: 'Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button Link' },
        { field: 'buttonNewTab', label: 'Open link in a new tab', type: 'checkbox' },
        { field: 'buttonEnabled', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  gardenJournal: {
    // No standalone "Replace Background Image" quick action - offered as a
    // Solid/Image choice inside Section Settings instead, same pattern as
    // plantFinder (see backgroundImage below).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
    ],
    // "See all ->" gets its own "Edit See All Link" Quick Action (same
    // reusable pattern as Plant Finder's CTA button) rather than being
    // folded into schema.text, since it has its own URL + show/hide.
    button: {
      label: 'See All Link',
      fields: [
        { field: 'seeAllText', label: 'Link Text' },
        { field: 'seeAllLink', label: 'Link URL' },
        { field: 'seeAllEnabled', label: 'Show link on live site', type: 'checkbox' },
      ],
    },
    cards: {
      field: 'posts',
      label: 'Blog Cards',
      itemLabel: 'Blog Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'linkText', label: 'Link Text (optional, defaults to "Read guide ->")', type: 'text' },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  giftingBand: {
    images: [{ field: 'image', label: 'Main Image' }],
    // Background image is offered separately as a Solid/Image choice
    // inside Section Settings (same reusable pattern as plantFinder /
    // gardenJournal) - this is the section's own backdrop, distinct from
    // the hero photo above (`images`).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
    ],
    // Multiple independently-manageable card arrays on one section (feature
    // chips + CTA buttons) - `cards` stays the primary/first group for
    // backward compatibility, `cardGroups` (see EditableSection.jsx) adds
    // any further ones with their own Manage/Add Quick Actions.
    cards: {
      field: 'features',
      label: 'Feature Chips',
      itemLabel: 'Feature',
      itemTitleFields: ['text'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ['gift', 'clipboard', 'tag', 'chat'] },
        { field: 'text', label: 'Text', type: 'text' },
        { field: 'link', label: 'Link URL (optional)', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    cardGroups: [
      {
        field: 'buttons',
        label: 'Buttons',
        itemLabel: 'Button',
        itemTitleFields: ['text'],
        itemFields: [
          { field: 'text', label: 'Button Text', type: 'text' },
          { field: 'url', label: 'Button URL', type: 'text' },
          { field: 'icon', label: 'Icon', type: 'select', options: ['gift', 'clipboard', 'tag', 'chat'] },
          { field: 'style', label: 'Style', type: 'select', options: ['primary', 'secondary'] },
          { field: 'order', label: 'Display Order', type: 'number' },
          { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
        ],
      },
    ],
    settings: true,
    reset: true,
  },
  newsletter: {
    // Section backdrop, same reusable Solid/Image toggle as plantFinder,
    // gardenJournal and giftingBand.
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'successMessage', label: 'Success Message' },
      { field: 'errorMessage', label: 'Error Message' },
    ],
    // Named groups of scalar fields beyond the single primary `button` -
    // same "second (third, ...) independently-managed group" idea as
    // giftingBand's `cardGroups`, but for plain field groups rather than
    // repeatable arrays. Each renders its own "Edit <label>" Quick Action
    // and opens the same text_fields modal used by `button`.
    fieldGroups: [
      {
        key: 'heading',
        label: 'Heading',
        fields: [
          { field: 'heading', label: 'Heading Text' },
          { field: 'headingVisible', label: 'Show on live site', type: 'checkbox' },
        ],
      },
      {
        key: 'input',
        label: 'Email Input',
        fields: [
          { field: 'placeholder', label: 'Placeholder Text' },
          { field: 'inputRequired', label: 'Required', type: 'checkbox' },
          { field: 'inputVisible', label: 'Show input on live site', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Subscribe Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonAction', label: 'Action Label (informational - the form always submits the subscribe request)' },
        { field: 'buttonIcon', label: 'Icon', type: 'select', options: ['none', 'gift', 'clipboard', 'tag', 'chat'] },
        { field: 'buttonEnabled', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  faq: {
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
    ],
    cards: {
      field: 'items',
      label: 'FAQs',
      itemLabel: 'FAQ',
      itemTitleFields: ['question'],
      itemFields: [
        { field: 'question', label: 'Question', type: 'text' },
        { field: 'answer', label: 'Answer', type: 'textarea' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  contactHero: {
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
    images: [
      { field: 'phoneIcon', label: 'Phone Icon' },
      { field: 'emailIcon', label: 'Email Icon' },
      { field: 'locIcon', label: 'Location Icon' },
      { field: 'hoursIcon', label: 'Hours Icon' }
    ],
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
  aboutHero: {
    images: [{ field: 'image', label: 'Hero Image' }],
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'breadcrumb',
        label: 'Breadcrumb',
        fields: [
          { field: 'breadcrumbHomeText', label: 'Home Text' },
          { field: 'breadcrumbHomeUrl', label: 'Home Link' },
          { field: 'breadcrumbHomeVisible', label: 'Show "Home" crumb', type: 'checkbox' },
          { field: 'breadcrumbCurrentText', label: '"About Us" Text' },
          { field: 'breadcrumbCurrentUrl', label: '"About Us" Link (optional - leave blank for plain text)' },
          { field: 'breadcrumbCurrentVisible', label: 'Show "About Us" crumb', type: 'checkbox' },
        ],
      },
      {
        key: 'heading',
        label: 'Main Heading',
        fields: [
          { field: 'heading', label: 'Heading (start a new line for a line break)' },
          { field: 'headingVisible', label: 'Show heading', type: 'checkbox' },
        ],
      },
      {
        key: 'subtitle',
        label: 'Subheading',
        fields: [
          { field: 'subtitle', label: 'Subheading Text' },
          { field: 'subtitleVisible', label: 'Show subheading', type: 'checkbox' },
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
      {
        key: 'decorativeIcon',
        label: 'Decorative Icon',
        fields: [
          { field: 'decorativeIcon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIconVisible', label: 'Show icon', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Primary Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button URL' },
        { field: 'buttonIcon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'buttonVisible', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutStory: {
    images: [{ field: 'image', label: 'Story Image' }],
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'label',
        label: 'Section Label',
        fields: [
          { field: 'eyebrow', label: 'Label Text' },
          { field: 'labelVisible', label: 'Show label', type: 'checkbox' },
        ],
      },
      {
        key: 'heading',
        label: 'Main Heading',
        fields: [
          { field: 'heading', label: 'Heading (start a new line for a line break)' },
          { field: 'headingVisible', label: 'Show heading', type: 'checkbox' },
        ],
      },
      {
        key: 'text',
        label: 'Description',
        fields: [
          { field: 'text', label: 'Description Text' },
          { field: 'textVisible', label: 'Show description', type: 'checkbox' },
        ],
      },
      {
        key: 'decorativeIcon1',
        label: 'Decorative Icon (top)',
        fields: [
          { field: 'decorativeIcon1', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIcon1Visible', label: 'Show icon', type: 'checkbox' },
        ],
      },
      {
        key: 'decorativeIcon2',
        label: 'Decorative Icon (bottom)',
        fields: [
          { field: 'decorativeIcon2', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIcon2Visible', label: 'Show icon', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Learn More Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button URL' },
        { field: 'buttonIcon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'buttonVisible', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutStats: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Stats',
      itemLabel: 'Stat',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'value', label: 'Number', type: 'number' },
        { field: 'suffix', label: 'Suffix (e.g. "+")', type: 'text' },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutVisionMission: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Vision & Mission Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'eyebrow', label: 'Label' },
        { field: 'title', label: 'Title' },
        { field: 'text', label: 'Description', type: 'textarea' },
        { field: 'image', label: 'Background Image', type: 'image' },
        { field: 'imageAlt', label: 'Image Alt Text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutOffer: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle', type: 'textarea' },
    ],
    fieldGroups: [
      {
        key: 'script',
        label: 'Decorative Script Text',
        fields: [
          { field: 'scriptLine1', label: 'Line 1' },
          { field: 'scriptLine2', label: 'Line 2' },
          { field: 'scriptLine3', label: 'Line 3' },
        ],
      },
    ],
    cards: {
      field: 'cards',
      label: 'Offer Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutValues: {
    images: [{ field: 'image', label: 'Image' }],
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle', type: 'textarea' },
    ],
    fieldGroups: [
      {
        key: 'script',
        label: 'Decorative Script Text',
        fields: [
          { field: 'scriptLine1', label: 'Line 1' },
          { field: 'scriptLine2', label: 'Line 2' },
          { field: 'scriptLine3', label: 'Line 3' },
          { field: 'scriptLine4', label: 'Line 4' },
        ],
      },
    ],
    cards: {
      field: 'items',
      label: 'Value Cards',
      itemLabel: 'Value',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutJourney: {
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle', type: 'textarea' },
    ],
    cards: {
      field: 'items',
      label: 'Journey Cards',
      itemLabel: 'Card',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'year', label: 'Year', type: 'text' },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutFinalCta: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'title', label: 'Heading' },
      { field: 'text', label: 'Description', type: 'textarea' },
    ],
    button: {
      label: 'Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button Link' },
      ],
    },
    settings: true,
    reset: true,
  },
  plantsHubHero: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heroEyebrow', label: 'Small Label' },
      { field: 'heroTitle', label: 'Heading' },
      { field: 'heroSubtitle', label: 'Description', type: 'textarea' },
    ],
    settings: true,
    reset: true,
  },
  plantsHubExplore: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'categories',
      label: 'Category Cards',
      itemLabel: 'Category',
      itemTitleFields: ['label', 'slug'],
      itemFields: [
        { field: 'slug', label: 'Category Slug (links to that category page)', type: 'text' },
        { field: 'label', label: "Display Name (optional - leave blank to use the category's real name)", type: 'text' },
        { field: 'image', label: 'Image (optional - leave blank to use the default illustration)', type: 'image' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  plantsHubPopular: {
    text: [
      { field: 'popularPlantsSubtitle', label: 'Subtitle' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  seedsHubHero: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heroEyebrow', label: 'Small Label' },
      { field: 'heroTitle', label: 'Heading' },
      { field: 'heroSubtitle', label: 'Description', type: 'textarea' },
    ],
    settings: true,
    reset: true,
  },
  seedsHubExplore: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'categories',
      label: 'Category Cards',
      itemLabel: 'Category',
      itemTitleFields: ['label', 'slug'],
      itemFields: [
        { field: 'slug', label: 'Category Slug (links to that category page)', type: 'text' },
        { field: 'label', label: "Display Name (optional - leave blank to use the category's real name)", type: 'text' },
        { field: 'image', label: 'Image (optional - leave blank to use the default illustration)', type: 'image' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  seedsHubPopular: {
    text: [
      { field: 'popularPlantsSubtitle', label: 'Subtitle' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  potsHubHero: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heroEyebrow', label: 'Small Label' },
      { field: 'heroTitle', label: 'Heading' },
      { field: 'heroSubtitle', label: 'Description', type: 'textarea' },
    ],
    settings: true,
    reset: true,
  },
  potsHubExplore: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'categories',
      label: 'Category Cards',
      itemLabel: 'Category',
      itemTitleFields: ['label', 'slug'],
      itemFields: [
        { field: 'slug', label: 'Category Slug (links to that category page)', type: 'text' },
        { field: 'label', label: "Display Name (optional - leave blank to use the category's real name)", type: 'text' },
        { field: 'image', label: 'Image (optional - leave blank to use the default illustration)', type: 'image' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  potsHubPopular: {
    text: [
      { field: 'popularPlantsSubtitle', label: 'Subtitle' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  plantCareHubHero: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heroEyebrow', label: 'Small Label' },
      { field: 'heroTitle', label: 'Heading' },
      { field: 'heroSubtitle', label: 'Description', type: 'textarea' },
    ],
    settings: true,
    reset: true,
  },
  plantCareHubExplore: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'categories',
      label: 'Category Cards',
      itemLabel: 'Category',
      itemTitleFields: ['label', 'slug'],
      itemFields: [
        { field: 'slug', label: 'Category Slug (links to that category page)', type: 'text' },
        { field: 'label', label: "Display Name (optional - leave blank to use the category's real name)", type: 'text' },
        { field: 'image', label: 'Image (optional - leave blank to use the default illustration)', type: 'image' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  plantCareHubPopular: {
    text: [
      { field: 'popularPlantsSubtitle', label: 'Subtitle' },
    ],
    products: { note: 'Products shown here are pulled live from your catalogue.' },
    settings: true,
    reset: true,
  },
  blogPage: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'title', label: 'Title' },
      { field: 'tagline', label: 'Tagline' },
    ],
    cards: {
      field: 'posts',
      label: 'Blog Cards',
      itemLabel: 'Blog Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { field: 'linkText', label: 'Link Text', type: 'text' },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  contactPage: {
    hero: {
      text: [
        { field: 'heading', label: 'Heading' },
        { field: 'description', label: 'Description', type: 'textarea' },
      ],
      images: [
        { field: 'image', label: 'Background Image' },
      ],
    },
    infoCards: {
      text: [
        { field: 'phoneHeading', label: 'Phone Card Heading' },
        { field: 'phoneSub', label: 'Phone Card Subtitle' },
        { field: 'phoneText', label: 'Phone Number' },
        { field: 'phoneHours', label: 'Phone Hours' },
        { field: 'emailHeading', label: 'Email Card Heading' },
        { field: 'emailSub', label: 'Email Card Subtitle' },
        { field: 'emailText', label: 'Email Address' },
        { field: 'emailNote', label: 'Email Note' },
        { field: 'locHeading', label: 'Location Card Heading' },
        { field: 'locSub', label: 'Location Card Subtitle' },
        { field: 'locText', label: 'Location Address', type: 'textarea' },
        { field: 'hoursHeading', label: 'Business Hours Heading' },
        { field: 'hoursSub', label: 'Business Hours Subtitle' },
        { field: 'hoursText1', label: 'Hours Line 1' },
        { field: 'hoursText2', label: 'Hours Line 2' },
      ],
    },
    form: {
      text: [
        { field: 'heading', label: 'Form Heading' },
        { field: 'description', label: 'Form Description', type: 'textarea' },
        { field: 'nameLabel', label: 'Name Field Label' },
        { field: 'emailLabel', label: 'Email Field Label' },
        { field: 'phoneLabel', label: 'Phone Field Label' },
        { field: 'messageLabel', label: 'Message Field Label' },
        { field: 'buttonText', label: 'Button Text' },
        { field: 'perk1Heading', label: 'Feature 1 Heading' },
        { field: 'perk1Text', label: 'Feature 1 Text' },
        { field: 'perk2Heading', label: 'Feature 2 Heading' },
        { field: 'perk2Text', label: 'Feature 2 Text' },
        { field: 'perk3Heading', label: 'Feature 3 Heading' },
        { field: 'perk3Text', label: 'Feature 3 Text' },
      ],
      images: [
        { field: 'sideImage', label: 'Form Side Image' },
      ],
    },
    farm: {
      text: [
        { field: 'heading', label: 'Farm Heading' },
        { field: 'description', label: 'Farm Description', type: 'textarea' },
        { field: 'buttonText', label: 'Get Directions Button Text' },
        { field: 'mapUrl', label: 'Map Embed URL (OpenStreetMap iframe src)' },
        { field: 'mapLabel', label: 'Map Pin Label' },
        { field: 'directionsUrl', label: 'Get Directions Link URL' },
      ],
    },
    whatsapp: {
      text: [
        { field: 'heading', label: 'WhatsApp Heading' },
        { field: 'description', label: 'WhatsApp Description' },
        { field: 'buttonText', label: 'WhatsApp Button Text' },
        { field: 'number', label: 'WhatsApp Number (with country code, no +)' },
      ],
      images: [
        { field: 'bgImage', label: 'Background Image' },
      ],
    },
    settings: true,
    reset: true,
  },
};

export const getSectionSchema = (key) => SECTION_SCHEMAS[key] || { settings: true, reset: true };
