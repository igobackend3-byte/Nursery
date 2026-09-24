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


def hub_descs(prefix, noun):
    return f"""    {prefix}Hero: 'Hero banner with small label, heading, description and background image.',
    {prefix}Explore: "Category circle row - each card's image, name and visibility individually editable.",
    {prefix}Popular: 'Popular {noun} grid, pulled live from your catalogue - each product individually editable.',
"""

new_descs = (
    hub_descs('plantsHub', 'plants')
    + hub_descs('seedsHub', 'seeds')
    + hub_descs('potsHub', 'products')
    + hub_descs('plantCareHub', 'products')
)

apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    aboutOffer: 'What We Offer cards - each image, icon, title, description and link individually editable.',
  };""",
"""    aboutOffer: 'What We Offer cards - each image, icon, title, description and link individually editable.',
""" + new_descs + "  };"
),
])

print("SectionList.jsx descriptions added")
