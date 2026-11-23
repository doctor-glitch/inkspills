import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  resource,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddToCart } from '../../core/add-to-cart';
import { SeoService } from '../../core/seo.service';
import type { BookSummary } from '../../data/models';
import copy from '../../data/sample/copy.json';
import { AccountService, CatalogService } from '../../data/services';
import { fill } from '../../shared/format/fill';
import { BookCard } from '../../shared/ui/book-card/book-card';
import { Button } from '../../shared/ui/button/button';
import { GenreChips } from '../../shared/ui/genre-chips/genre-chips';

/** Books catalog and search results at /books?genre=&q= (no XD artboard; follows the Home styles). */
@Component({
  selector: 'app-catalog',
  imports: [RouterLink, BookCard, Button, GenreChips],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  /** Query params, bound by withComponentInputBinding(). */
  readonly genre = input<string | undefined>('');
  readonly q = input<string | undefined>('');

  private readonly catalog = inject(CatalogService);
  private readonly account = inject(AccountService);
  private readonly router = inject(Router);
  private readonly addToCart = inject(AddToCart);
  private readonly seo = inject(SeoService);
  protected readonly text = copy.catalog;

  protected readonly query = computed(() => ({
    genre: this.genre()?.trim() ?? '',
    q: this.q()?.trim() ?? '',
  }));

  protected readonly genres = resource({
    loader: () => this.catalog.listGenres(),
    defaultValue: [],
  });

  protected readonly books = resource({
    params: () => this.query(),
    loader: ({ params }) => this.catalog.listBooks(params),
  });

  protected readonly wishlist = resource({
    loader: () => this.account.wishlistIds(),
    defaultValue: [],
  });

  protected readonly wishSet = computed(() => new Set(this.wishlist.value()));

  protected readonly heading = computed(() => {
    const q = this.query().q;
    return q ? fill(this.text.resultsFor, { q }) : this.text.title;
  });

  protected readonly countText = computed(() => {
    const n = this.books.value()?.length ?? 0;
    return n === 1 ? this.text.countOne : fill(this.text.count, { count: n });
  });

  constructor() {
    effect(() => {
      const q = this.query().q;
      this.seo.set(
        q
          ? {
              title: fill(copy.seo.search.title, { q }),
              description: fill(copy.seo.search.description, { q }),
            }
          : copy.seo.catalog,
      );
    });
  }

  protected selectGenre(slug: string): void {
    void this.router.navigate(['/books'], {
      queryParams: { genre: slug || null },
      queryParamsHandling: 'merge',
    });
  }

  protected add(book: BookSummary): void {
    void this.addToCart.add(book, 'buy');
  }
}
