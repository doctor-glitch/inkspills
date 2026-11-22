import type { Cents } from '../../data/models';

const cad = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats integer cents as Canadian dollars for display: 2999 -> "$29.99".
 * Display only. The server re-prices every order.
 */
export function formatCad(cents: Cents): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`formatCad expects integer cents, got ${cents}`);
  }
  return cad.format(cents / 100);
}
