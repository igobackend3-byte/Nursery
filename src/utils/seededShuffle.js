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

export const JUST_IN_SEED = 20240601;

export function getJustInProducts(products, count) {
  const targetNames = [
    'Balsam Seeds',
    'Compost Accelerator Culture (200-500g)',
    'Insect-Proof Agro Net',
    'Neem Seeds',
    'White Mussaenda'
  ];

  const forcedProducts = targetNames.map(name => {
    const prod = products.find(p => p.name === name);
    return prod ? { ...prod } : null;
  }).filter(Boolean);

  const remainingCount = count - forcedProducts.length;
  if (remainingCount <= 0) {
    return forcedProducts.slice(0, count);
  }

  const otherProducts = products.filter(p => !targetNames.includes(p.name));
  const shuffledOthers = seededShuffle(otherProducts, JUST_IN_SEED);
  
  return [...forcedProducts, ...shuffledOthers.slice(0, remainingCount)];
}
