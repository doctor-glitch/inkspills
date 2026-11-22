import { formatCad } from './money';

describe('formatCad', () => {
  it('formats integer cents as CAD with two decimals', () => {
    expect(formatCad(2999)).toBe('$29.99');
    expect(formatCad(49)).toBe('$0.49');
    expect(formatCad(0)).toBe('$0.00');
    expect(formatCad(123456)).toBe('$1,234.56');
  });

  it('formats negative amounts', () => {
    expect(formatCad(-500)).toBe('-$5.00');
  });

  it('rejects non-integer input so floats never sneak into money', () => {
    expect(() => formatCad(29.99)).toThrow(/integer cents/);
  });
});
