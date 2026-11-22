import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';
import type { FormCheckboxControl, ValidationError } from '@angular/forms/signals';
import { Icon } from '../icon/icon';

let nextId = 0;

/**
 * Native checkbox styled as the XD 18 px box (blue when checked). The label is projected,
 * so it can contain links ("I agree to the terms and rental policy").
 * Works with [(checked)] or Signal Forms [formField]. `tone="dark"` is for the footer.
 */
@Component({
  selector: 'app-checkbox',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': 'tone() === "dark"' },
  template: `
    <input
      class="native"
      type="checkbox"
      [id]="id"
      [attr.name]="name() || null"
      [checked]="checked()"
      [disabled]="disabled()"
      [required]="required()"
      [attr.aria-invalid]="touched() && invalid() ? 'true' : null"
      (change)="onChange($event)"
      (blur)="touch.emit()"
    />
    <span class="box" aria-hidden="true">
      @if (checked()) {
        <app-icon name="check" [size]="10" />
      }
    </span>
    <label class="text" [for]="id"><ng-content /></label>
  `,
  styleUrl: './checkbox.scss',
})
export class Checkbox implements FormCheckboxControl {
  readonly checked = model(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly touch = output<void>();

  readonly tone = input<'light' | 'dark'>('light');

  protected readonly id = `checkbox-${nextId++}`;

  protected onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
