import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CLOCK } from '../../core/clock';
import type { RatingBreakdown, Review } from '../../data/models';
import copy from '../../data/sample/copy.json';
import { fill } from '../../shared/format/fill';
import { compactCount, relativeTime } from '../../shared/format/relative-time';
import { Button } from '../../shared/ui/button/button';
import { RatingStars } from '../../shared/ui/rating-stars/rating-stars';
import { Tag } from '../../shared/ui/tag/tag';

/**
 * Reader reviews on the book page: average, per-star breakdown bars and the latest reviews.
 * "Write a review" and "Read all" are inactive until reviews are built (step 2c).
 */
@Component({
  selector: 'app-book-reviews',
  imports: [Button, RatingStars, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-reviews.html',
  styleUrl: './book-reviews.scss',
})
export class BookReviews {
  readonly ratingAvg = input.required<number>();
  readonly ratingCount = input.required<number>();
  readonly breakdown = input<RatingBreakdown | null>(null);
  readonly reviews = input<readonly Review[]>([]);

  private readonly now = inject(CLOCK);
  protected readonly text = copy.book;

  protected readonly count = computed(() => compactCount(this.ratingCount()));
  protected readonly summary = computed(() => fill(this.text.outOf5, { count: this.count() }));
  protected readonly readAll = computed(() => fill(this.text.readAllReviews, { count: this.count() }));
  protected readonly bars = computed(() => {
    const b = this.breakdown();
    if (!b) return [];
    return (['5', '4', '3', '2', '1'] as const).map((star) => ({ star, pct: b[star] }));
  });

  protected readonly items = computed(() => {
    const now = this.now();
    return this.reviews().map((r) => {
      const acquired = this.text.acquiredTags[r.acquired];
      return {
        ...r,
        initial: r.reviewerName.charAt(0),
        acquiredLabel: acquired,
        when: `${acquired}, ${relativeTime(r.createdAt, now)}`,
      };
    });
  });
}
