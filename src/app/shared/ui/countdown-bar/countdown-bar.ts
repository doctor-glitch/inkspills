import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CLOCK } from '../../../core/clock';
import type { IsoDate } from '../../../data/models';
import { countdown, formatShortDate } from './countdown';

/**
 * Red rental countdown: "Rental period · 10 of 28 days left" over a bar that empties as time passes.
 * Exposed as a progressbar whose value text includes the access end date.
 */
@Component({
  selector: 'app-countdown-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row" aria-hidden="true">
      <span class="label">{{ label() }}</span>
      <span class="left">{{ leftText() }}</span>
    </div>
    <div
      class="track"
      role="progressbar"
      [attr.aria-label]="label()"
      aria-valuemin="0"
      [attr.aria-valuemax]="state().totalDays"
      [attr.aria-valuenow]="state().daysLeft"
      [attr.aria-valuetext]="valueText()"
    >
      <span class="fill" [style.width.%]="state().fraction * 100"></span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--font-sans);
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      font-size: var(--text-2xs);
    }
    .label {
      color: var(--color-slate);
    }
    .left {
      font-weight: var(--weight-semibold);
      color: var(--color-ink);
    }
    .track {
      height: 6px;
      border-radius: 3px;
      background: var(--color-red-tint);
      overflow: hidden;
    }
    .fill {
      display: block;
      height: 100%;
      border-radius: 3px;
      background: var(--color-red);
      transition: width var(--duration-base) var(--ease-out);
    }
  `,
})
export class CountdownBar {
  readonly startsAt = input.required<IsoDate>();
  readonly endsAt = input.required<IsoDate>();
  readonly label = input('Rental period');

  private readonly now = inject(CLOCK);

  protected readonly state = computed(() =>
    countdown(new Date(this.startsAt()), new Date(this.endsAt()), this.now()),
  );

  protected readonly leftText = computed(() => {
    const s = this.state();
    return s.ended ? 'Access ended' : `${s.daysLeft} of ${s.totalDays} days left`;
  });

  protected readonly valueText = computed(() => {
    const s = this.state();
    const until = formatShortDate(new Date(this.endsAt()));
    return s.ended
      ? `Access ended ${until}`
      : `${s.daysLeft} of ${s.totalDays} days left, access until ${until}`;
  });
}
