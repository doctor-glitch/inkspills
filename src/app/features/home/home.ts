import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddToCart } from '../../core/add-to-cart';
import { SeoService } from '../../core/seo.service';
import type { BookSummary } from '../../data/models';
import copy from '../../data/sample/copy.json';
import { AccountService, CatalogService } from '../../data/services';
import { fill } from '../../shared/format/fill';
import { formatCad } from '../../shared/format/money';
import { BookRail } from '../../shared/ui/book-rail/book-rail';
import { Button } from '../../shared/ui/button/button';
import { GenreChips } from '../../shared/ui/genre-chips/genre-chips';
import { Icon } from '../../shared/ui/icon/icon';
import { PricePill } from '../../shared/ui/price-pill/price-pill';
import { Tag } from '../../shared/ui/tag/tag';

/** Home: hero with staff pick, genre chips, New arrivals, Buy/Rent explainer, Recommended, Best sellers. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, BookRail, Button, GenreChips, Icon, PricePill, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly catalog = inject(CatalogService);
  private readonly account = inject(AccountService);
  private readonly router = inject(Router);
  private readonly addToCart = inject(AddToCart);
  protected readonly text = copy.home;

  protected readonly data = resource({
    loader: async () => {
      const [genres, all, heroCovers, staffPick, newArrivals, recommended, bestSellers] =
        await Promise.all([
          this.catalog.listGenres(),
          this.catalog.listBooks(),
          this.catalog.getHeroCovers(),
          this.catalog.getStaffPick(),
          this.catalog.getRail('newArrivals'),
          this.catalog.getRail('recommended'),
          this.catalog.getRail('bestSellers'),
        ]);
      return { genres, all, heroCovers, staffPick, newArrivals, recommended, bestSellers };
    },
  });

  protected readonly wishlist = resource({
    loader: () => this.account.wishlistIds(),
    defaultValue: [],
  });

  /** "Own it from $1.99" and "Rent from $0.49/week", from the cheapest book in the catalog. */
  protected readonly fromPrices = computed(() => {
    const all = this.data.value()?.all ?? [];
    if (!all.length) return null;
    const minBuy = Math.min(...all.map((b) => b.buyPriceCents));
    const minRent = Math.min(...all.map((b) => b.rentWeekCents));
    return {
      own: fill(this.text.hero.ownFrom, { price: formatCad(minBuy) }),
      rent: fill(this.text.hero.rentFrom, { price: formatCad(minRent) }),
    };
  });

  constructor() {
    inject(SeoService).set(copy.seo.home);
  }

  protected openGenre(slug: string): void {
    void this.router.navigate(['/books'], { queryParams: slug ? { genre: slug } : {} });
  }

  protected add(book: BookSummary): void {
    void this.addToCart.add(book, 'buy');
  }
}
