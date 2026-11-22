import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icons';

/**
 * Small status tag. buy = blue ("Purchased", "Buy"), rent = red ("Rented", countdowns),
 * paid = green, neutral = grey ("Paid $12.99"), plain = white on a tinted panel.
 */
export type TagTone = 'buy' | 'rent' | 'paid' | 'neutral' | 'plain';

@Component({
  selector: 'app-tag',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"tag tag--" + tone() + (small() ? " tag--sm" : "")' },
  template: `
    @if (icon(); as name) {
      <app-icon [name]="name" [size]="12" />
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      height: 1.5rem;
      padding: 0 0.5625rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: var(--text-2xs);
      font-weight: var(--weight-semibold);
      line-height: 1;
      white-space: nowrap;
    }
    :host(.tag--sm) {
      height: 1.25rem;
      font-size: var(--text-3xs);
    }
    :host(.tag--buy) {
      background: var(--color-blue-tint);
      color: var(--color-blue-text);
    }
    :host(.tag--rent) {
      background: var(--color-red-tint);
      color: var(--color-red-text);
    }
    :host(.tag--paid) {
      background: var(--color-green-tint);
      color: var(--color-green);
    }
    :host(.tag--neutral) {
      background: var(--color-page);
      color: var(--color-slate);
    }
    :host(.tag--plain) {
      background: var(--color-white);
      color: var(--color-ink);
    }
  `,
})
export class Tag {
  readonly tone = input<TagTone>('neutral');
  readonly icon = input<IconName>();
  readonly small = input(false);
}
