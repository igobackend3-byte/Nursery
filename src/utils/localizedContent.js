// Per-language overrides for real catalogue content (product names,
// category labels/taglines) - stored on the product/category doc itself as
// an optional `translations: { ta: {...}, hi: {...}, ml: {...}, te: {...},
// kn: {...} }` map, entered by the admin (see admin Products/Categories
// edit forms). English is always the base `name`/`label`/`tagline` field -
// never overwritten, always the fallback when a language hasn't been
// filled in yet for that item. This is deliberately NOT auto-translated -
// see the conversation record for why machine-translating real product/
// business content at scale was declined in favour of this admin-entry
// path.
export function getLocalizedProductName(product, language) {
  if (!product) return '';
  return product.translations?.[language]?.name || product.name;
}

export function getLocalizedCategoryLabel(category, language) {
  if (!category) return '';
  return category.translations?.[language]?.label || category.label;
}

export function getLocalizedCategoryTagline(category, language) {
  if (!category) return '';
  return category.translations?.[language]?.tagline || category.tagline || '';
}
