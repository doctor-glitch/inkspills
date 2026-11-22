import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type ButtonVariant = 'buy' | 'rent' | 'secondary' | 'dark' | 'ghost-dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Buttons from the XD style guide.
 * buy = blue fill (primary actions), rent = red outline, secondary = white with grey border,
 * dark = ink fill, ghost-dark = outline for ink surfaces.
 *
 * Use on a native element: <button appButton="buy">Buy now</button> or <a appButton="secondary" href>.
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'btn',
    '[class]': 'classes()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.aria-disabled]': 'loading() || null',
  },
  template: `
    @if (loading()) {
      <span class="btn__spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('buy', { alias: 'appButton' });
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    [
      `btn--${this.variant() || 'buy'}`,
      `btn--${this.size()}`,
      this.block() ? 'btn--block' : '',
      this.loading() ? 'btn--loading' : '',
    ].join(' '),
  );
}
