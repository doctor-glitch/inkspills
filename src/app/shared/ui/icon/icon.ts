import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, type IconName } from './icons';

/**
 * Inline SVG icon drawn from the XD icon paths. Colour follows `currentColor`.
 * Decorative by default; pass `label` when the icon carries meaning on its own.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      [attr.aria-hidden]="label() ? null : 'true'"
      focusable="false"
    >
      @for (p of def().paths; track $index) {
        <path
          [attr.d]="p.d"
          [attr.transform]="'translate(' + p.x + ' ' + p.y + ')'"
          [attr.fill]="filled() ? 'currentColor' : 'none'"
          [attr.stroke]="filled() ? null : 'currentColor'"
          [attr.stroke-width]="strokeWidth()"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      line-height: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  /** Rendered size in px. */
  readonly size = input(16);
  readonly label = input<string>();
  /** Draw outlined icons filled (used for the active wishlist heart). */
  readonly fill = input(false);

  protected readonly def = computed(() => ICONS[this.name()]);
  protected readonly viewBox = computed(() => `0 0 ${this.def().w} ${this.def().h}`);
  protected readonly filled = computed(() => this.def().stroke === 0 || this.fill());
  protected readonly strokeWidth = computed(() => {
    const s = this.def().stroke;
    return s === 0 ? null : s;
  });
}
