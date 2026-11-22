import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';
import type { FormCheckboxControl, ValidationError } from '@angular/forms/signals';

let nextId = 0;

/**
 * On/off switch (46 x 26 px, blue when on), e.g. "Rental reminders".
 * A native button with role="switch" and aria-checked; the label is projected.
 */
@Component({
  selector: 'app-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="text" [id]="labelId"><ng-content /></span>
    <button
      type="button"
      role="switch"
      class="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-labelledby]="labelId"
      [attr.aria-describedby]="describedBy() || null"
      [attr.name]="name() || null"
      [disabled]="disabled()"
      (click)="toggle()"
      (blur)="touch.emit()"
    >
      <span class="thumb"></span>
    </button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      font-family: var(--font-sans);
    }
    .switch {
      position: relative;
      flex: none;
      width: 2.875rem;
      height: 1.625rem;
      border-radius: var(--radius-pill);
      background: var(--color-control-border);
      transition: background-color var(--duration-base) var(--ease-out);
    }
    .switch[aria-checked='true'] {
      background: var(--color-blue);
    }
    .switch:focus-visible {
      outline: none;
      box-shadow:
        var(--focus-ring),
        0 0 0 1px var(--color-blue);
    }
    .switch:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: var(--color-white);
      box-shadow: var(--shadow-segment);
      transition: transform var(--duration-base) var(--ease-out);
    }
    .switch[aria-checked='true'] .thumb {
      transform: translateX(1.25rem);
    }
  `,
})
export class Toggle implements FormCheckboxControl {
  readonly checked = model(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly touch = output<void>();

  /** id of an element describing the switch, e.g. "Email me two days before a rental ends." */
  readonly describedBy = input<string>();

  protected readonly labelId = `toggle-label-${nextId++}`;

  protected toggle(): void {
    if (this.disabled()) return;
    this.checked.update((v) => !v);
  }
}
