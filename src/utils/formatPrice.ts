export function formatPrice(
  price: number | string,
  currency: string = 'IDR',
  locale: string = 'id-ID',
  showCurrencySymbol: boolean = true
): string {
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number
  if (isNaN(numPrice)) {
    return 'Invalid price';
  }
  
  // Format the number with thousand separators
  return numPrice.toLocaleString(locale, {
    style: showCurrencySymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
