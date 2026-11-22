import { TestBed } from '@angular/core/testing';
import { CLOCK } from '../../../core/clock';
import { countdown, formatShortDate } from './countdown';
import { CountdownBar } from './countdown-bar';

// Mere Christianity in the Rented books artboard: 4-week rental, 10 of 28 days left on Nov 21.
const STARTS = '2026-11-03T12:00:00.000Z';
const ENDS = '2026-12-01T12:00:00.000Z';
const DESIGN_NOW = new Date('2026-11-21T12:00:00.000Z');

describe('countdown()', () => {
  it('matches the design: 10 of 28 days left', () => {
    const c = countdown(new Date(STARTS), new Date(ENDS), DESIGN_NOW);
    expect(c).toEqual({ totalDays: 28, daysLeft: 10, fraction: 10 / 28, ended: false });
  });

  it('rounds a partial day up so the last day still shows 1 day left', () => {
    const c = countdown(new Date(STARTS), new Date(ENDS), new Date('2026-12-01T11:00:00.000Z'));
    expect(c.daysLeft).toBe(1);
    expect(c.ended).toBe(false);
  });

  it('reaches zero and ended at the end time and after', () => {
    expect(countdown(new Date(STARTS), new Date(ENDS), new Date(ENDS))).toMatchObject({
      daysLeft: 0,
      fraction: 0,
      ended: true,
    });
    expect(
      countdown(new Date(STARTS), new Date(ENDS), new Date('2027-01-01T00:00:00.000Z')).daysLeft,
    ).toBe(0);
  });

  it('never shows more days left than the period, even before it starts', () => {
    const c = countdown(new Date(STARTS), new Date(ENDS), new Date('2026-10-01T00:00:00.000Z'));
    expect(c.daysLeft).toBe(28);
    expect(c.fraction).toBe(1);
  });

  it('formats the access date like the design ("Dec 1")', () => {
    expect(formatShortDate(new Date(2026, 11, 1))).toBe('Dec 1');
  });
});

describe('CountdownBar', () => {
  function render(now: Date) {
    TestBed.configureTestingModule({ providers: [{ provide: CLOCK, useValue: () => now }] });
    const fixture = TestBed.createComponent(CountdownBar);
    fixture.componentRef.setInput('startsAt', STARTS);
    fixture.componentRef.setInput('endsAt', ENDS);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows days left and sizes the bar from the injected clock', () => {
    const el = render(DESIGN_NOW);
    expect(el.querySelector('.left')!.textContent).toBe('10 of 28 days left');
    const fill = el.querySelector<HTMLElement>('.fill')!;
    expect(parseFloat(fill.style.width)).toBeCloseTo((10 / 28) * 100, 2);
  });

  it('exposes an accessible progressbar with the access date', () => {
    const bar = render(DESIGN_NOW).querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('28');
    expect(bar.getAttribute('aria-valuenow')).toBe('10');
    expect(bar.getAttribute('aria-valuetext')).toMatch(
      /^10 of 28 days left, access until Dec \d+$/,
    );
  });

  it('says access ended after the end date', () => {
    const el = render(new Date('2026-12-05T00:00:00.000Z'));
    expect(el.querySelector('.left')!.textContent).toBe('Access ended');
    expect(el.querySelector<HTMLElement>('.fill')!.style.width).toBe('0%');
  });
});
