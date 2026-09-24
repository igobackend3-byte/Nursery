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


# ================================================================
# sectionSchemas.js - add 12 new schema entries (Hero / Explore /
# Popular x 4 hubs). Explore's `categories` cards let each landing
# category tile get an optional image/label override (matching the
# already-proven shopByCategory.tiles pattern) without ever touching the
# real category record; the routing Link stays fixed to the real
# category's slug on purpose (same scope limit as shopByCategory).
# Popular reuses the generic `products` schema mechanism already proven
# on Home.jsx's plantsPeopleLove/justIn sections.
# ================================================================

def hub_schemas(prefix):
    return f"""  {prefix}Hero: {{
    backgroundImage: {{ field: 'backgroundImage', label: 'Background Image' }},
    text: [
      {{ field: 'heroEyebrow', label: 'Small Label' }},
      {{ field: 'heroTitle', label: 'Heading' }},
      {{ field: 'heroSubtitle', label: 'Description', type: 'textarea' }},
    ],
    settings: true,
    reset: true,
  }},
  {prefix}Explore: {{
    backgroundImage: {{ field: 'backgroundImage', label: 'Background Image' }},
    cards: {{
      field: 'categories',
      label: 'Category Cards',
      itemLabel: 'Category',
      itemTitleFields: ['label', 'slug'],
      itemFields: [
        {{ field: 'slug', label: 'Category Slug (links to that category page)', type: 'text' }},
        {{ field: 'label', label: "Display Name (optional - leave blank to use the category's real name)", type: 'text' }},
        {{ field: 'image', label: 'Image (optional - leave blank to use the default illustration)', type: 'image' }},
        {{ field: 'order', label: 'Display Order', type: 'number' }},
        {{ field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' }},
      ],
    }},
    settings: true,
    reset: true,
  }},
  {prefix}Popular: {{
    text: [
      {{ field: 'popularPlantsSubtitle', label: 'Subtitle' }},
    ],
    products: {{ note: 'Products shown here are pulled live from your catalogue.' }},
    settings: true,
    reset: true,
  }},
"""

new_schemas = "".join(hub_schemas(p) for p in ['plantsHub', 'seedsHub', 'potsHub', 'plantCareHub'])

apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  aboutFinalCta: {
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
};""",
"""  aboutFinalCta: {
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
""" + new_schemas + "};"
),
])

print("PART 2 (sectionSchemas.js) applied")
