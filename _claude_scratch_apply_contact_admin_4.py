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
# Batch 4: register the new "Contact Us" Admin Panel page - beside
# "Blog" in the Pages grid, in the Visual Editor's pageId resolver, and
# in the sidebar's per-page title/section-description lookups.
# --------------------------------------------------------------------

# 1) PagesList.jsx - add the Contact Us card right after Blog.
apply(f"{ROOT}/src/admin/pages/PagesList.jsx", [
    (
        "  { id: 'blog', title: 'Blog', description: 'Garden journal and care guides.' }\n];",
        "  { id: 'blog', title: 'Blog', description: 'Garden journal and care guides.' },\n"
        "  { id: 'contact', title: 'Contact Us', description: 'Contact page - info cards, message form, map and WhatsApp banner.' }\n];",
    ),
])

# 2) VisualEditor.jsx - import Contact and resolve pageId === 'contact'.
apply(f"{ROOT}/src/admin/editor/VisualEditor.jsx", [
    (
        "import Blog from '../../pages/Blog';",
        "import Blog from '../../pages/Blog';\nimport Contact from '../../pages/Contact';",
    ),
    (
        "  } else if (pageId === 'blog') {\n    PageComponent = <Blog />;\n  }",
        "  } else if (pageId === 'blog') {\n    PageComponent = <Blog />;\n  } else if (pageId === 'contact') {\n    PageComponent = <Contact />;\n  }",
    ),
])

# 3) SectionList.jsx - page title/noun for the sidebar header, plus a
# description for each of the 6 new contactX section keys.
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
    (
        "    plantCareHubPopular: 'Popular products grid, pulled live from your catalogue - each product individually editable.',\n  };",
        "    plantCareHubPopular: 'Popular products grid, pulled live from your catalogue - each product individually editable.',\n"
        "    contactHero: 'Hero banner with heading, description and background image.',\n"
        "    contactInfoCards: 'Phone, Email, Location and Business Hours info cards.',\n"
        "    contactForm: \"'Send Us a Message' form - heading, side image, field labels and submit button.\",\n"
        "    contactTrust: 'Support/trust strip - three perk columns.',\n"
        "    contactFarm: 'Find Our Farm section - heading, description, Get Directions button and map.',\n"
        "    contactWhatsapp: 'WhatsApp Quick Help banner - heading, description, number and background image.',\n"
        "  };",
    ),
    (
        "  'plant-care': { title: 'Plant Care Page', noun: 'Plant Care page' },\n};",
        "  'plant-care': { title: 'Plant Care Page', noun: 'Plant Care page' },\n"
        "  contact: { title: 'Contact Page', noun: 'Contact page' },\n};",
    ),
])

print("PagesList.jsx / VisualEditor.jsx / SectionList.jsx: Contact Us page registered")
