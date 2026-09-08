// Deterministic shuffle (linear congruential generator) so "random"
// selections like the "Just In" list stay stable across reloads/pages
// instead of re-randomizing on every render. Shared by the Home page's
// JustIn section and the dedicated /just-in page so both read from the
// exact same ordering - no duplicated product lists.
export function seededShuffle(array, seed) {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// The single source of truth for "Just In" - same seed used everywhere
// so the homepage preview and the full listing page show the same
// products in the same order, just sliced to a different length.
export const JUST_IN_SEED = 20240601;

export function getJustInProducts(products, count) {
  return seededShuffle(products, JUST_IN_SEED).slice(0, count);
}
