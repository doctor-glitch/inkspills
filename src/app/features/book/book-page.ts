import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddToCart } from '../../core/add-to-cart';
import { SeoService } from '../../core/seo.service';
import type { AcquireMode, BookSummary } from '../../data/models';
import copy from '../../data/sample/copy.json';
import { AccountService, CatalogService, ReviewService } from '../../data/services';
import { fill } from '../../shared/format/fill';
import { formatCad } from '../../shared/format/money';
import { compactCount } from '../../shared/format/relative-time';
import { BookRail } from '../../shared/ui/book-rail/book-rail';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { RatingStars } from '../../shared/ui/rating-stars/rating-stars';
import { Tag } from '../../shared/ui/tag/tag';
import { bookJsonLd } from './book-json-ld';
import { BookReviews } from './book-reviews';

/** Book details at /books/:slug: buy and rent panel, about, more information, reviews, Readers also liked. */
@Component({
  selector: 'app-book-page',
  imports: [RouterLink, BookRail, BookReviews, Button, Icon, RatingStars, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
})
export class BookPage {
  /** Route param, bound by withComponentInputBinding(). */
  readonly slug = input.required<string>();

  private readonly catalog = inject(CatalogService);
  private readonly reviewService = inject(ReviewService);
  private readonly account = inject(AccountService);
  private readonly addToCart = inject(AddToCart);
  private readonly seo = inject(SeoService);
  protected readonly text = copy.book;
  protected readonly notFound = copy.notFound;
  protected readonly perkIcons = ['book', 'check', 'check'] as const;

  protected readonly detail = resource({
    params: () => this.slug(),
    loader: ({ params }) => this.catalog.getBookBySlug(params),
  });

  protected readonly reviews = resource({
    params: () => this.detail.value()?.book.id,
    loader: ({ params }) => this.reviewService.listForBook(params, 2),
    defaultValue: [],
  });

  protected readonly alsoLiked = resource({
    params: () => this.slug(),
    loader: ({ params }) => this.catalog.readersAlsoLiked(params),
    defaultValue: [],
  });

  protected readonly wishlist = resource({
    loader: () => this.account.wishlistIds(),
    defaultValue: [],
  });

  /** The highlighted option card. Buy now and Rent now each add their own mode. */
  protected readonly mode = signal<AcquireMode>('buy');

  protected readonly view = computed(() => {
    const d = this.detail.value();
    if (!d) return null;
    const { book, genre } = d;
    return {
      ...d,
      buyPrice: formatCad(book.buyPriceCents),
      rentPrice: formatCad(book.rentWeekCents),
      reviewsCount: fill(this.text.reviewsCount, { count: compactCount(book.ratingCount) }),
      wishlisted: this.wishlist.value().includes(book.id),
      info: [
        { label: this.text.infoLabels.pages, value: String(book.pages) },
        { label: this.text.infoLabels.genre, value: genre.name },
        { label: this.text.infoLabels.year, value: String(book.year) },
        { label: this.text.infoLabels.publisher, value: book.publisher },
        { label: this.text.infoLabels.category, value: book.category },
        { label: this.text.infoLabels.format, value: book.fileFormat },
      ],
    };
  });

  constructor() {
    effect(() => {
      if (this.detail.isLoading()) return;
      const d = this.detail.value();
      if (!d) {
        this.seo.set(copy.seo.notFound);
        return;
      }
      this.seo.set({
        title: fill(copy.seo.book.title, { title: d.book.title, author: d.author.name }),
        description: fill(copy.seo.book.description, { tagline: d.book.tagline }),
      });
      this.seo.setJsonLd(bookJsonLd(d));
    });
  }

  protected acquire(mode: AcquireMode): void {
    const d = this.detail.value();
    if (d) void this.addToCart.add(d.book, mode, 1);
  }

  protected addSummary(book: BookSummary): void {
    void this.addToCart.add(book, 'buy');
  }
}
