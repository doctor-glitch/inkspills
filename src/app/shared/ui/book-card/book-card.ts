import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BookSummary } from '../../../data/models';
import { Icon } from '../icon/icon';
import { PricePill } from '../price-pill/price-pill';
import { RatingStars } from '../rating-stars/rating-stars';

/**
 * Book card from the Home rails: 3:4 cover, wishlist heart, optional "Staff pick" flag,
 * author and rating, title, split price pill and an add-to-cart button.
 * The title link is stretched over the cover so the card has a single link.
 */
@Component({
  selector: 'app-book-card',
  imports: [RouterLink, Icon, PricePill, RatingStars],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  readonly book = input.required<BookSummary>();
  readonly wishlisted = input(false, { transform: booleanAttribute });
  readonly showStaffPick = input(false, { transform: booleanAttribute });
  /** Set on the first cards above the fold so the browser loads them eagerly. */
  readonly priority = input(false, { transform: booleanAttribute });

  readonly wishlistToggle = output<BookSummary>();
  readonly addToCart = output<BookSummary>();
}
