import { InjectionToken } from '@angular/core';

/** Returns the current time. Inject this instead of calling Date.now() so tests can control time. */
export type Clock = () => Date;

export const CLOCK = new InjectionToken<Clock>('CLOCK', {
  providedIn: 'root',
  factory: () => () => new Date(),
});
