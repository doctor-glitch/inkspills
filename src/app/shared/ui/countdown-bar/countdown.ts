// Pure countdown maths for rentals, kept separate so it is easy to unit-test.
// Display only: the server decides when a rental really ends (rentals.ends_at).

const DAY_MS = 24 * 60 * 60 * 1000;

export interface Countdown {
  /** Whole days in the rental period (e.g. 28 for 4 weeks). */
  totalDays: number;
  /** Days left, rounded up so the last partial day still counts; 0 once ended. */
  daysLeft: number;
  /** Share of the period remaining, 0..1. */
  fraction: number;
  ended: boolean;
}

export function countdown(startsAt: Date, endsAt: Date, now: Date): Countdown {
  const totalDays = Math.max(1, Math.round((endsAt.getTime() - startsAt.getTime()) / DAY_MS));
  const msLeft = endsAt.getTime() - now.getTime();
  const daysLeft = msLeft <= 0 ? 0 : Math.min(totalDays, Math.ceil(msLeft / DAY_MS));
  return { totalDays, daysLeft, fraction: daysLeft / totalDays, ended: msLeft <= 0 };
}

const shortDate = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });

/** "Dec 1" */
export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}
