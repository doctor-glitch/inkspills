import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { Icon } from '../icon/icon';

let nextId = 0;

/**
 * Labelled text input with hint and error state (red border, red ring, alert icon, message).
 * Works standalone with [(value)] or with Signal Forms via [formField].
 * The error shows when `error` is set, or when the field is touched and invalid.
 */
@Component({
  selector: 'app-text-input',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements FormValueControl<string> {
  // FormValueControl contract
  readonly value = model('');
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly touch = output<void>();

  // Presentation
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'search' | 'url'>('text');
  readonly placeholder = input('');
  readonly hint = input('');
  /** Explicit error message. Overrides messages from `errors`. */
  readonly error = input('');
  readonly autocomplete = input<string>();
  readonly inputmode = input<string>();

  protected readonly id = `text-input-${nextId++}`;
  protected readonly hintId = `${this.id}-hint`;
  protected readonly errorId = `${this.id}-error`;
  protected readonly revealed = signal(false);
  private readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly errorMessage = computed(() => {
    if (this.error()) return this.error();
    if (!this.touched()) return '';
    const first = this.errors().find((e) => e.message);
    return first?.message ?? (this.invalid() ? 'Check this field.' : '');
  });
  protected readonly showError = computed(() => this.errorMessage() !== '');
  protected readonly inputType = computed(() =>
    this.type() === 'password' && this.revealed() ? 'text' : this.type(),
  );
  protected readonly describedBy = computed(
    () =>
      [this.showError() ? this.errorId : '', this.hint() ? this.hintId : '']
        .filter(Boolean)
        .join(' ') || null,
  );

  focus(options?: FocusOptions): void {
    this.inputEl().nativeElement.focus(options);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected toggleReveal(): void {
    this.revealed.update((v) => !v);
  }
}
