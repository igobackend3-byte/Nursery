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
import { getSpecValueTranslation } from '../i18n/translations';

export function getLocalizedProductName(product, language) {
  if (!product) return '';
  return product.translations?.[language]?.name || product.name;
}

// Product spec fields (maintenance, watering, light, location, size) are
// drawn from a small fixed vocabulary shared across every product - see
// `specValues` in i18n/translations.js. Never touches actual data values
// like SKU, price, quantity or dimensions - those are passed through as-is
// by every caller, this is only ever used for the descriptive spec text.
// `location` in particular can be an array (filter facets pick several -
// see data/products.js), so this joins translated array entries for display.
export function getLocalizedSpecValue(value, language) {
  if (Array.isArray(value)) {
    return value.map((v) => getSpecValueTranslation(v, language)).join(', ');
  }
  return getSpecValueTranslation(value, language);
}

export function getLocalizedCategoryLabel(category, language) {
  if (!category) return '';
  return category.translations?.[language]?.label || category.label;
}

export function getLocalizedCategoryTagline(category, language) {
  if (!category) return '';
  return category.translations?.[language]?.tagline || category.tagline || '';
}
