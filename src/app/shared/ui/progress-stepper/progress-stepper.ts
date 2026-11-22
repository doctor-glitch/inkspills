import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Purchase progress: Cart, Details and payment, Done.
 * Completed steps show a blue tick, the current step a blue outline, later steps grey.
 */
@Component({
  selector: 'app-progress-stepper',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="steps" [attr.aria-label]="label()">
      @for (step of steps(); track step; let i = $index; let last = $last) {
        <li
          class="step"
          [class.step--done]="i < current()"
          [class.step--current]="i === current()"
          [attr.aria-current]="i === current() ? 'step' : null"
        >
          <span class="dot" aria-hidden="true">
            @if (i < current()) {
              <app-icon name="check" [size]="10" />
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span class="name">
            {{ step }}
            @if (i < current()) {
              <span class="visually-hidden">(completed)</span>
            }
          </span>
          @if (!last) {
            <span class="bar" aria-hidden="true"></span>
          }
        </li>
      }
    </ol>
  `,
  styles: `
    .steps {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: var(--font-sans);
    }
    .step {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-muted);
    }
    .dot {
      display: grid;
      place-items: center;
      width: 1.625rem;
      height: 1.625rem;
      border: 1px solid var(--color-line);
      border-radius: 50%;
      font-size: var(--text-2xs);
      font-weight: var(--weight-bold);
    }
    .step--current {
      color: var(--color-ink);
    }
    .step--current .dot {
      border-color: var(--color-blue);
      color: var(--color-blue);
    }
    .step--done {
      color: var(--color-ink);
    }
    .step--done .dot {
      border-color: var(--color-blue);
      background: var(--color-blue);
      color: var(--color-white);
    }
    .bar {
      width: 3.5rem;
      height: 2px;
      background: var(--color-line);
    }
    @media (max-width: 767.98px) {
      .bar {
        width: 1rem;
      }
      .step:not(.step--current) .name {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
    }
  `,
})
export class ProgressStepper {
  readonly steps = input<readonly string[]>(['Cart', 'Details and payment', 'Done']);
  /** Zero-based index of the current step. Use steps.length to mark every step done. */
  readonly current = input(0);
  readonly label = input('Checkout progress');
}
