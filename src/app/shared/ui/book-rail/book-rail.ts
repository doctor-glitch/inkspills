import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BookSummary } from '../../../data/models';
import { BookCard } from '../book-card/book-card';
import { Icon } from '../icon/icon';

let nextId = 0;

/**
 * A titled row of book cards ("New arrivals", "Best sellers", "Readers also liked").
 * Mobile: swipeable scroll-snap row. Tablet and up: previous/next buttons as well.
 */
@Component({
  selector: 'app-book-rail',
  imports: [RouterLink, BookCard, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-rail.html',
  styleUrl: './book-rail.scss',
})
export class BookRail {
  readonly heading = input.required<string>();
  readonly subtitle = input('');
  /** Router link for "See all". Hidden when empty. */
  readonly seeAllLink = input<string | readonly unknown[] | null>(null);
  readonly seeAllQuery = input<Record<string, string> | null>(null);
  readonly books = input.required<readonly BookSummary[]>();
  readonly wishlistIds = input<ReadonlySet<string> | readonly string[]>([]);
  readonly showStaffPick = input(false, { transform: booleanAttribute });
  /** Load the first covers eagerly (use for the first rail on a page). */
  readonly priority = input(false, { transform: booleanAttribute });

  readonly wishlistToggle = output<BookSummary>();
  readonly addToCart = output<BookSummary>();

  protected readonly headingId = `book-rail-${nextId++}`;
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  private readonly wishSet = computed(() => {
    const ids = this.wishlistIds();
    return ids instanceof Set ? ids : new Set(ids as readonly string[]);
  });

  constructor() {
    // Measure only in the browser, after the first render.
    afterNextRender(() => this.updateEdges());
  }

  protected isWishlisted(id: string): boolean {
    return this.wishSet().has(id);
  }

  protected scroll(direction: -1 | 1): void {
    const el = this.track().nativeElement;
    const left = direction * el.clientWidth * 0.9;
    if (typeof el.scrollBy === 'function') {
      el.scrollBy({ left, behavior: 'smooth' });
    } else {
      el.scrollLeft += left;
    }
    this.updateEdges();
  }

  protected updateEdges(): void {
    const el = this.track().nativeElement;
    this.atStart.set(el.scrollLeft <= 1);
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }
}
