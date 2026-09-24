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
# PART 1 - siteContent.js: trim plantsHub down to just the navbar
# dropdown (still read directly by NavBar.jsx - untouched), drop
# seedsHub/potsHub/plantCareHub entirely, and add 12 new flat top-level
# keys (Hero/Explore/Popular per hub) so each is independently
# reset/deleted/settings-managed by the Visual Editor - same convention
# as every About section already migrated. `productIds` (not
# `featuredProductIds`) is used on purpose: ProductSectionManager /
# ProductCardHoverControls hardcode that exact field name.
# ================================================================
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  // Admin-configurable picks for the Plants navbar dropdown, the /plants
  // landing page, and its featured-plants strip. All three reference real
  // category slugs / product ids - nothing is duplicated here, just an
  // ordered list of which real records to show and where.
  plantsHub: {
    heroEyebrow: 'PLANTS',
    heroTitle: 'Plants',
    heroSubtitle: 'Bring nature closer to your home. Discover a wide range of beautiful plants for every space and style.',
    navbarCategorySlugs: ['indoor-plants', 'cactus', 'outdoor-plants', 'succulents', 'fruit-plants'],
    landingCategorySlugs: [
      'indoor-plants', 'outdoor-plants', 'succulents', 'cactus', 'palms', 'bonsai', 'orchids',
      'bromeliads', 'ferns', 'hanging-basket-plants', 'herbs', 'fruit-plants', 'table-top-plants',
    ],
    popularPlantsSubtitle: 'Handpicked favourites loved by plant parents.',
    featuredProductIds: [],
  },
  seedsHub: {
    heroEyebrow: 'SEEDS',
    heroTitle: 'Seeds',
    heroSubtitle: 'Explore a wide range of quality seeds for vegetables, flowers, herbs, fruits and more.',
    landingCategorySlugs: [],
    popularPlantsSubtitle: 'Popular choices for home gardens and kitchen gardens.',
    featuredProductIds: [],
  },
  potsHub: {
    heroEyebrow: 'POTS & PLANTERS',
    heroTitle: 'Pots & Planters',
    heroSubtitle: 'Find beautiful pots and planters designed to complement your plants and spaces.',
    landingCategorySlugs: [],
    popularPlantsSubtitle: 'Handpicked pots and planters for every space and style.',
    featuredProductIds: [],
  },
  plantCareHub: {
    heroEyebrow: 'PLANT CARE',
    heroTitle: 'Plant Care',
    heroSubtitle: 'Everything you need to keep your plants healthy, beautiful and growing throughout the year.',
    landingCategorySlugs: [],
    popularPlantsSubtitle: 'Essential products for healthy and thriving plants.',
    featuredProductIds: [],
  },""",
"""  // Admin-configurable pick for the "Plants ▾" navbar dropdown only. The
  // /plants landing page itself (hero, categories, popular products) now
  // lives on the flat plantsHubHero/plantsHubExplore/plantsHubPopular
  // keys below, same as every other section-hub page - see those for
  // seeds/pots/plant-care too.
  plantsHub: {
    navbarCategorySlugs: ['indoor-plants', 'cactus', 'outdoor-plants', 'succulents', 'fruit-plants'],
  },
  // Section-hub pages (Plants / Seeds / Pots & Planters / Plant Care) -
  // each hub has 3 flat, independently manageable keys: Hero, Explore
  // Categories, and Popular Products. This mirrors the About page
  // convention (one real siteContent key per Visual Editor section) and
  // fixes the previous dotted pseudo-keys (`${contentKey}.hero` etc.)
  // that Reset/Delete/Settings couldn't actually operate on.
  plantsHubHero: {
    visible: true, order: 1, backgroundColor: '', backgroundImage: '', paddingY: '',
    heroEyebrow: 'PLANTS',
    heroTitle: 'Plants',
    heroSubtitle: 'Bring nature closer to your home. Discover a wide range of beautiful plants for every space and style.',
  },
  plantsHubExplore: {
    visible: true, order: 2, backgroundColor: '', backgroundImage: '', paddingY: '',
    categories: [],
  },
  plantsHubPopular: {
    visible: true, order: 3, backgroundColor: '', backgroundImage: '', paddingY: '',
    popularPlantsSubtitle: 'Handpicked favourites loved by plant parents.',
    productIds: [],
  },
  seedsHubHero: {
    visible: true, order: 1, backgroundColor: '', backgroundImage: '', paddingY: '',
    heroEyebrow: 'SEEDS',
    heroTitle: 'Seeds',
    heroSubtitle: 'Explore a wide range of quality seeds for vegetables, flowers, herbs, fruits and more.',
  },
  seedsHubExplore: {
    visible: true, order: 2, backgroundColor: '', backgroundImage: '', paddingY: '',
    categories: [],
  },
  seedsHubPopular: {
    visible: true, order: 3, backgroundColor: '', backgroundImage: '', paddingY: '',
    popularPlantsSubtitle: 'Popular choices for home gardens and kitchen gardens.',
    productIds: [],
  },
  potsHubHero: {
    visible: true, order: 1, backgroundColor: '', backgroundImage: '', paddingY: '',
    heroEyebrow: 'POTS & PLANTERS',
    heroTitle: 'Pots & Planters',
    heroSubtitle: 'Find beautiful pots and planters designed to complement your plants and spaces.',
  },
  potsHubExplore: {
    visible: true, order: 2, backgroundColor: '', backgroundImage: '', paddingY: '',
    categories: [],
  },
  potsHubPopular: {
    visible: true, order: 3, backgroundColor: '', backgroundImage: '', paddingY: '',
    popularPlantsSubtitle: 'Handpicked pots and planters for every space and style.',
    productIds: [],
  },
  plantCareHubHero: {
    visible: true, order: 1, backgroundColor: '', backgroundImage: '', paddingY: '',
    heroEyebrow: 'PLANT CARE',
    heroTitle: 'Plant Care',
    heroSubtitle: 'Everything you need to keep your plants healthy, beautiful and growing throughout the year.',
  },
  plantCareHubExplore: {
    visible: true, order: 2, backgroundColor: '', backgroundImage: '', paddingY: '',
    categories: [],
  },
  plantCareHubPopular: {
    visible: true, order: 3, backgroundColor: '', backgroundImage: '', paddingY: '',
    popularPlantsSubtitle: 'Essential products for healthy and thriving plants.',
    productIds: [],
  },"""
),
])

print("PART 1 (siteContent.js) applied")
