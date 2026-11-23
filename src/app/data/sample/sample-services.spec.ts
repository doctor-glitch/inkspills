import { TestBed } from '@angular/core/testing';
import { provideSampleData } from '../provide-data';
import {
  AccountService,
  AuthService,
  CartService,
  CatalogService,
  ReviewService,
} from '../services';
import { SampleCatalogService } from './sample-catalog.service';

function setup() {
  TestBed.configureTestingModule({ providers: [provideSampleData()] });
  return {
    catalog: TestBed.inject(CatalogService),
    reviews: TestBed.inject(ReviewService),
    cart: TestBed.inject(CartService),
    auth: TestBed.inject(AuthService),
    account: TestBed.inject(AccountService),
  };
}

describe('provideSampleData', () => {
  it('selects the sample implementations', () => {
    expect(setup().catalog).toBeInstanceOf(SampleCatalogService);
  });
});

describe('SampleCatalogService', () => {
  it('lists the 8 genres', async () => {
    const genres = await setup().catalog.listGenres();
    expect(genres.map((g) => g.slug)).toEqual([
      'poetry',
      'fiction',
      'fantasy',
      'self-help',
      'money',
      'food-and-travel',
      'faith',
      'art-and-design',
    ]);
  });

  it('lists every book as a summary with the author name', async () => {
    const books = await setup().catalog.listBooks();
    expect(books).toHaveLength(22);
    expect(books[0]).toEqual({
      id: 'book-your-soul-is-a-river',
      slug: 'your-soul-is-a-river',
      title: 'Your Soul is a River',
      authorName: 'Nikita Gill',
      coverPath: '/assets/images/books/your-soul-is-a-river.jpg',
      ratingAvg: 4.5,
      buyPriceCents: 2999,
      rentWeekCents: 299,
      staffPick: true,
    });
  });

  it('filters by genre slug', async () => {
    const books = await setup().catalog.listBooks({ genre: 'poetry' });
    expect(books.length).toBeGreaterThan(0);
    expect(books.map((b) => b.slug)).toContain('milk-and-honey');
    expect(books.map((b) => b.slug)).not.toContain('harry-potter');
  });

  it('returns nothing for an unknown genre', async () => {
    expect(await setup().catalog.listBooks({ genre: 'nope' })).toEqual([]);
  });

  it('searches title, author and genre, ignoring case and spaces', async () => {
    const { catalog } = setup();
    expect((await catalog.listBooks({ q: '  POTTER ' })).map((b) => b.slug)).toEqual([
      'harry-potter',
    ]);
    const byAuthor = await catalog.listBooks({ q: 'nikita gill' });
    expect(byAuthor.every((b) => b.authorName === 'Nikita Gill')).toBe(true);
    expect(byAuthor.length).toBe(2);
    expect((await catalog.listBooks({ q: 'fantasy' })).length).toBeGreaterThan(0);
  });

  it('combines genre and search', async () => {
    const books = await setup().catalog.listBooks({ genre: 'poetry', q: 'heart' });
    expect(books.map((b) => b.slug)).toEqual(['your-heart-is-the-sea']);
  });

  it('returns a book with its author, genre and rating breakdown', async () => {
    const detail = await setup().catalog.getBookBySlug('your-soul-is-a-river');
    expect(detail?.author.name).toBe('Nikita Gill');
    expect(detail?.genre.name).toBe('Poetry');
    expect(detail?.ratingBreakdown).toEqual({ '1': 1, '2': 3, '3': 7, '4': 21, '5': 68 });
    // Sample-only fields are stripped.
    expect(detail?.book).not.toHaveProperty('placeholder');
    expect(detail?.book).not.toHaveProperty('ratingBreakdown');
  });

  it('returns null for an unknown slug', async () => {
    expect(await setup().catalog.getBookBySlug('nope')).toBeNull();
  });

  it('returns the Home rails, hero covers and staff pick in design order', async () => {
    const { catalog } = setup();
    expect((await catalog.getRail('newArrivals')).map((b) => b.title)).toEqual([
      'Harry Potter',
      'Beyond Coffee',
      'The Kinfolk Table',
      'The Monocle Book',
      'This is For the Women',
    ]);
    expect((await catalog.getRail('recommended')).every((b) => b.staffPick)).toBe(true);
    expect(await catalog.getRail('bestSellers')).toHaveLength(5);
    expect((await catalog.getHeroCovers()).map((b) => b.slug)).toEqual([
      'the-two-towers',
      'your-soul-is-a-river',
      'milk-and-honey',
    ]);
    expect((await catalog.getStaffPick()).slug).toBe('your-soul-is-a-river');
  });

  it('uses the curated Readers also liked list when there is one', async () => {
    const liked = await setup().catalog.readersAlsoLiked('your-soul-is-a-river');
    expect(liked.map((b) => b.slug)).toEqual([
      'your-heart-is-the-sea',
      'milk-and-honey',
      'this-is-for-the-women',
      'all-the-letters-i-should-have-sent',
      'the-first-new-universe',
    ]);
  });

  it('falls back to same-genre books, never the book itself', async () => {
    const { catalog } = setup();
    const liked = await catalog.readersAlsoLiked('milk-and-honey');
    expect(liked.length).toBeGreaterThan(0);
    expect(liked.length).toBeLessThanOrEqual(5);
    expect(liked.map((b) => b.slug)).not.toContain('milk-and-honey');
    expect(await catalog.readersAlsoLiked('nope')).toEqual([]);
  });
});

describe('SampleReviewService', () => {
  it('lists a book’s reviews newest first and honours the limit', async () => {
    const { reviews } = setup();
    const all = await reviews.listForBook('book-your-soul-is-a-river');
    expect(all.map((r) => r.reviewerName)).toEqual(['Priya S.', 'Daniel R.']);
    expect(await reviews.listForBook('book-your-soul-is-a-river', 1)).toHaveLength(1);
    expect(await reviews.listForBook('book-happy')).toEqual([]);
  });
});

describe('SampleCartService', () => {
  it('starts with the sample cart and keeps saved changes', async () => {
    const { cart } = setup();
    const items = await cart.load();
    expect(items).toHaveLength(9);
    await cart.save(items.slice(0, 1));
    expect(await cart.load()).toEqual(items.slice(0, 1));
  });

  it('hands out copies, so callers cannot change the stored cart', async () => {
    const { cart } = setup();
    const items = await cart.load();
    items[0].mode = 'rent';
    expect((await cart.load())[0].mode).toBe('buy');
  });
});

describe('SampleAuthService', () => {
  it('starts signed in as the sample reader', async () => {
    expect(await setup().auth.session()).toEqual({
      userId: 'user-alex',
      email: 'alex.morgan@example.com',
      fullName: 'Alex Morgan',
    });
  });

  it('signs out, signs in and signs up in memory', async () => {
    const { auth } = setup();
    await auth.signOut();
    expect(await auth.session()).toBeNull();
    expect((await auth.signIn('alex.morgan@example.com', 'x')).userId).toBe('user-alex');
    const created = await auth.signUp('Sam Lee', 'sam@example.com', 'secret');
    expect(created).toMatchObject({ fullName: 'Sam Lee', email: 'sam@example.com' });
    expect(await auth.session()).toEqual(created);
  });
});

describe('SampleAccountService', () => {
  it('returns the sample profile without placeholder markers', async () => {
    const profile = await setup().account.profile();
    expect(profile.fullName).toBe('Alex Morgan');
    expect(profile).not.toHaveProperty('placeholder');
  });

  it('returns orders, purchases, rentals and wishlist ids', async () => {
    const { account } = setup();
    expect((await account.orders()).length).toBeGreaterThan(0);
    expect((await account.purchases()).length).toBeGreaterThan(0);
    expect((await account.rentals()).length).toBeGreaterThan(0);
    expect(await account.wishlistIds()).toContain('book-the-kinfolk-table');
  });
});
