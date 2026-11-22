import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
} from '@angular/core';
import { Icon } from '../icon/icon';

let nextId = 0;

/**
 * Gold star rating (gold is for ratings only).
 * - default: five stars, partially filled for fractional values ("Rated 4.5 out of 5").
 * - compact: one star and the number, as on book cards ("4.8").
 * - editable: a radio group for choosing 1 to 5 stars (Write a review).
 */
@Component({
  selector: 'app-rating-stars',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
})
export class RatingStars {
  readonly value = model(0);
  readonly compact = input(false, { transform: booleanAttribute });
  readonly editable = input(false, { transform: booleanAttribute });
  readonly size = input(14);
  /** Accessible name of the editable group. */
  readonly label = input('Your rating');

  protected readonly name = `rating-${nextId++}`;
  protected readonly stars = [1, 2, 3, 4, 5] as const;
  protected readonly display = computed(() => this.value().toFixed(1));
  protected readonly ariaLabel = computed(() => `Rated ${this.display()} out of 5`);

  /** Fill fraction 0..1 for each of the five stars. */
  protected readonly fills = computed(() => {
    const v = Math.max(0, Math.min(5, this.value()));
    return this.stars.map((s) => Math.max(0, Math.min(1, v - (s - 1))));
  });

  protected choose(star: number): void {
    this.value.set(star);
  }
}
