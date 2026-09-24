// Shared by every place a product's discount is shown (product cards,
// product detail) so the percentage is always derived from the live
// original/selling price rather than a separately-stored value.
export function getDiscountPercent(originalPrice, price) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
