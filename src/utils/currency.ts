/**
 * Utilidad universal de deteccion y formateo de precios y monedas del comercio
 */

export function getCurrencySymbol(currency: string = 'USD'): string {
  const c = (currency || 'USD').trim().toUpperCase();
  if (c === 'CRC') return '₡';
  if (c === 'EUR') return '€';
  if (c === 'GBP') return '£';
  if (c === 'BRL') return 'R$';
  return '$';
}

export function formatPriceWithCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  showCode: boolean = true
): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const c = (currency || 'USD').trim().toUpperCase();
  const symbol = getCurrencySymbol(c);

  let formattedNumber = '';
  if (c === 'CRC') {
    formattedNumber = Math.round(safeAmount).toLocaleString('es-CR');
  } else {
    formattedNumber = safeAmount.toFixed(2);
  }

  return showCode ? `${symbol}${formattedNumber} ${c}` : `${symbol}${formattedNumber}`;
}
