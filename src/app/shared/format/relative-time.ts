const DAY = 24 * 60 * 60 * 1000;

/** "today", "3 days ago", "2 weeks ago", "last month", ... for review dates. */
export function relativeTime(iso: string, now: Date): string {
  // Nearest whole day, so a review 13.9 days old reads "2 weeks ago" as in the design.
  const days = Math.round((now.getTime() - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'last week';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return 'last month';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  if (days < 730) return 'last year';
  return `${Math.floor(days / 365)} years ago`;
}

/** 10000 -> "10k", 1250 -> "1.3k", 840 -> "840". */
export function compactCount(n: number): string {
  if (n < 1000) return String(n);
  const k = Math.round(n / 100) / 10;
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
}
