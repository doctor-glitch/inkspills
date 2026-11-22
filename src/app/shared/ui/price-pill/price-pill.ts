import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Cents } from '../../../data/models';
import { formatCad } from '../../format/money';

/**
 * Split price pill from the XD: blue "buy" half and red "/wk" rent half.
 * Either half can be omitted (pass null).
 */
@Component({
  selector: 'app-price-pill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'group', '[attr.aria-label]': 'ariaLabel()' },
  template: `
    @if (buyCents() !== null) {
      <span class="half half--buy" aria-hidden="true">
        <strong>{{ buy() }}</strong> <small>buy</small>
      </span>
    }
    @if (rentWeekCents() !== null) {
      <span class="half half--rent" aria-hidden="true">
        <strong>{{ rent() }}</strong><small>/wk</small>
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      border: 1px solid var(--color-line);
      border-radius: var(--radius-md);
      overflow: hidden;
      font-family: var(--font-sans);
      line-height: 1;
      white-space: nowrap;
    }
    .half {
      display: inline-flex;
      align-items: baseline;
      gap: 0.25em;
      padding: 0.5rem 0.625rem;
    }
    .half--buy {
      background: var(--color-blue-tint);
      color: var(--color-blue-text);
    }
    .half--rent {
      gap: 0.125em;
      background: var(--color-red-tint);
      color: var(--color-red-text);
    }
    strong {
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
    }
    small {
      font-size: var(--text-3xs);
      font-weight: var(--weight-medium);
    }
  `,
})
export class PricePill {
  readonly buyCents = input<Cents | null>(null);
  readonly rentWeekCents = input<Cents | null>(null);

  protected readonly buy = computed(() => {
    const c = this.buyCents();
    return c === null ? '' : formatCad(c);
  });
  protected readonly rent = computed(() => {
    const c = this.rentWeekCents();
    return c === null ? '' : formatCad(c);
  });
  protected readonly ariaLabel = computed(() =>
    [
      this.buyCents() !== null ? `Buy for ${this.buy()}` : '',
      this.rentWeekCents() !== null ? `rent for ${this.rent()} a week` : '',
    ]
      .filter(Boolean)
      .join(', '),
  );
}
