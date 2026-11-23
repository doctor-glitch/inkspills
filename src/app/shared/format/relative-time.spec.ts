import { compactCount, relativeTime } from './relative-time';

const NOW = new Date('2026-11-21T12:00:00.000Z');
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

describe('relativeTime()', () => {
  it('matches the design review dates', () => {
    expect(relativeTime('2026-11-07T15:00:00.000Z', NOW)).toBe('2 weeks ago'); // Priya S.
    expect(relativeTime('2026-10-20T15:00:00.000Z', NOW)).toBe('last month'); // Daniel R.
  });

  it('covers each range', () => {
    expect(relativeTime(daysAgo(0), NOW)).toBe('today');
    expect(relativeTime(daysAgo(1), NOW)).toBe('yesterday');
    expect(relativeTime(daysAgo(3), NOW)).toBe('3 days ago');
    expect(relativeTime(daysAgo(8), NOW)).toBe('last week');
    expect(relativeTime(daysAgo(21), NOW)).toBe('3 weeks ago');
    expect(relativeTime(daysAgo(95), NOW)).toBe('3 months ago');
    expect(relativeTime(daysAgo(400), NOW)).toBe('last year');
    expect(relativeTime(daysAgo(800), NOW)).toBe('2 years ago');
  });
});

describe('compactCount()', () => {
  it('shortens thousands like the design ("10k reviews")', () => {
    expect(compactCount(840)).toBe('840');
    expect(compactCount(10000)).toBe('10k');
    expect(compactCount(1250)).toBe('1.3k');
  });
});
