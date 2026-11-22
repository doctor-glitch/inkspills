import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  effect,
  input,
  model,
  viewChild,
} from '@angular/core';

let nextId = 0;

/**
 * Modal dialog on the native <dialog> element: focus is trapped and returned by the browser,
 * Esc and backdrop clicks close it unless `dismissible` is false (e.g. "Logging out…").
 * Put action buttons in an element with the `dialog-actions` attribute.
 */
@Component({
  selector: 'app-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="dialog"
      [attr.aria-labelledby]="heading() ? headingId : null"
      [attr.aria-label]="heading() ? null : ariaLabel() || null"
      (cancel)="onCancel($event)"
      (close)="open.set(false)"
      (click)="onClick($event)"
    >
      <div class="panel">
        @if (heading()) {
          <h2 class="heading" [id]="headingId">{{ heading() }}</h2>
        }
        <div class="content"><ng-content /></div>
        <div class="actions"><ng-content select="[dialog-actions]" /></div>
      </div>
    </dialog>
  `,
  styleUrl: './dialog.scss',
})
export class Dialog {
  readonly open = model(false);
  readonly heading = input('');
  /** Accessible name when there is no visible heading. */
  readonly ariaLabel = input('');
  readonly dismissible = input(true, { transform: booleanAttribute });

  protected readonly headingId = `dialog-heading-${nextId++}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      const shouldOpen = this.open();
      if (shouldOpen && !el.open) {
        // showModal is missing during SSR and in older test DOMs.
        if (typeof el.showModal === 'function') el.showModal();
        else el.setAttribute('open', '');
      } else if (!shouldOpen && el.open) {
        if (typeof el.close === 'function') el.close();
        else el.removeAttribute('open');
      }
    });
  }

  protected onCancel(event: Event): void {
    // Esc key
    event.preventDefault();
    if (this.dismissible()) this.open.set(false);
  }

  protected onClick(event: MouseEvent): void {
    // Clicks on the ::backdrop land on the <dialog> itself, not the panel.
    if (event.target === this.dialog().nativeElement && this.dismissible()) {
      this.open.set(false);
    }
  }
}
