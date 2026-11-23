/** Fills {name} tokens in copy.json strings: fill('Rent from {price}/week', { price: '$0.49' }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
