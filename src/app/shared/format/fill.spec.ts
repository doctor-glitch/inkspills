import { fill } from './fill';

describe('fill()', () => {
  it('replaces {name} tokens', () => {
    expect(fill('Rent from {price}/week', { price: '$0.49' })).toBe('Rent from $0.49/week');
    expect(fill('{title}, rent for {weeks}', { title: 'Happy', weeks: '2 weeks' })).toBe(
      'Happy, rent for 2 weeks',
    );
  });

  it('accepts numbers and leaves unknown tokens as they are', () => {
    expect(fill('{count} reviews {other}', { count: 3 })).toBe('3 reviews {other}');
  });
});
