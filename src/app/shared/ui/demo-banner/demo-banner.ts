import { ChangeDetectionStrategy, Component } from '@angular/core';

export const DEMO_BANNER_TEXT = 'Demo store. Payments use Stripe test mode; no real charges.';

/** Thin bar shown on every page in the v1.0 demo release. */
@Component({
  selector: 'app-demo-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'note', 'aria-label': 'Demo notice' },
  template: `{{ text }}`,
  styles: `
    :host {
      display: block;
      padding: 0.375rem var(--gutter);
      background: var(--color-ink);
      color: var(--color-footer-link);
      font-family: var(--font-sans);
      font-size: var(--text-2xs);
      font-weight: var(--weight-medium);
      line-height: 1.4;
      text-align: center;
    }
  `,
})
export class DemoBanner {
  protected readonly text = DEMO_BANNER_TEXT;
}
