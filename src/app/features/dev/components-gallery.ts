// TEMPORARY review page for the shared UI components. Delete before release (route: /dev/components).
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { CLOCK } from '../../core/clock';
import type { BookSummary } from '../../data/models';
import accountJson from '../../data/sample/account.json';
import catalogJson from '../../data/sample/catalog.json';
import type { SampleAccount, SampleCatalog } from '../../data/sample/sample-types';
import { BookCard } from '../../shared/ui/book-card/book-card';
import { BookRail } from '../../shared/ui/book-rail/book-rail';
import { Button } from '../../shared/ui/button/button';
import { Checkbox } from '../../shared/ui/checkbox/checkbox';
import { CountdownBar } from '../../shared/ui/countdown-bar/countdown-bar';
import { DemoBanner } from '../../shared/ui/demo-banner/demo-banner';
import { Dialog } from '../../shared/ui/dialog/dialog';
import { GenreChips } from '../../shared/ui/genre-chips/genre-chips';
import { Icon } from '../../shared/ui/icon/icon';
import { ICONS, type IconName } from '../../shared/ui/icon/icons';
import { PricePill } from '../../shared/ui/price-pill/price-pill';
import { ProgressStepper } from '../../shared/ui/progress-stepper/progress-stepper';
import { RatingStars } from '../../shared/ui/rating-stars/rating-stars';
import { Tag } from '../../shared/ui/tag/tag';
import { TextInput } from '../../shared/ui/text-input/text-input';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Toggle } from '../../shared/ui/toggle/toggle';

const catalog = catalogJson as unknown as SampleCatalog;
const account = accountJson as unknown as SampleAccount;
const DESIGN_NOW = new Date('2026-11-21T12:00:00.000Z');

function summary(slug: string): BookSummary {
  const b = catalog.books.find((x) => x.slug === slug)!;
  const author = catalog.authors.find((a) => a.id === b.authorId)!;
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    authorName: author.name,
    coverPath: b.coverPath,
    ratingAvg: b.ratingAvg,
    buyPriceCents: b.buyPriceCents,
    rentWeekCents: b.rentWeekCents,
    staffPick: b.staffPick,
  };
}

@Component({
  selector: 'app-components-gallery',
  imports: [
    JsonPipe,
    FormField,
    BookCard,
    BookRail,
    Button,
    Checkbox,
    CountdownBar,
    DemoBanner,
    Dialog,
    GenreChips,
    Icon,
    PricePill,
    ProgressStepper,
    RatingStars,
    Tag,
    TextInput,
    Toggle,
  ],
  // Countdowns show the design's 10, 15 and 20 days left.
  providers: [{ provide: CLOCK, useValue: () => DESIGN_NOW }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-gallery.html',
  styleUrl: './components-gallery.scss',
})
export class ComponentsGallery {
  private readonly toasts = inject(ToastService);

  protected readonly iconNames = Object.keys(ICONS) as IconName[];
  protected readonly genres = catalog.genres;
  protected readonly genre = signal('');

  protected readonly soul = summary('your-soul-is-a-river');
  protected readonly longTitle = summary('all-the-letters-i-should-have-sent');
  protected readonly money = summary('the-psychology-of-money');
  protected readonly newArrivals = catalog.rails.newArrivals.map(summary);
  protected readonly recommended = catalog.rails.recommended.map(summary);
  /** Long enough to scroll on desktop. */
  protected readonly longRail = [...this.recommended, ...this.newArrivals];
  protected readonly wishlist = signal<readonly string[]>(account.wishlist.bookIds);

  protected readonly rentals = account.rentals.map((r) => ({
    ...r,
    title: catalog.books.find((b) => b.id === r.bookId)!.title,
  }));

  protected readonly plain = signal('');
  protected readonly keepSignedIn = signal(true);
  protected readonly reminders = signal(true);
  protected readonly myRating = signal(0);
  protected readonly confirmOpen = signal(false);
  protected readonly loggingOutOpen = signal(false);
  protected readonly lastEvent = signal('none yet');

  // Signal Forms demo, same rules as the Log in form will use.
  protected readonly loginModel = signal({ email: '', password: '' });
  protected readonly loginForm = form(this.loginModel, (p) => {
    required(p.email, { message: 'Enter your email.' });
    email(p.email, { message: 'Enter a full email address, like name@example.com.' });
    required(p.password, { message: 'Enter your password.' });
    minLength(p.password, 8, { message: 'Use at least 8 characters.' });
  });

  protected toggleWish(book: BookSummary): void {
    this.wishlist.update((ids) =>
      ids.includes(book.id) ? ids.filter((id) => id !== book.id) : [...ids, book.id],
    );
    this.lastEvent.set(`wishlistToggle: ${book.title}`);
  }

  protected added(book: BookSummary): void {
    this.lastEvent.set(`addToCart: ${book.title}`);
    this.toasts.show({
      title: 'Added to cart',
      message: `${book.title}, buy to keep`,
      imageSrc: book.coverPath,
      action: { label: 'View cart', link: '/cart' },
    });
  }

  protected rentToast(): void {
    this.toasts.show({
      title: 'Added to cart',
      message: `${this.soul.title}, rent for 1 week`,
      imageSrc: this.soul.coverPath,
      action: { label: 'View cart', link: '/cart' },
    });
  }

  protected plainToast(): void {
    this.toasts.show({ title: 'Profile saved', duration: 0 });
  }

  protected showLoggingOut(): void {
    this.loggingOutOpen.set(true);
    setTimeout(() => this.loggingOutOpen.set(false), 2500);
  }
}
