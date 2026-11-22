// Checks the sample JSON extracted in step 1a is internally consistent and follows the product rules.
import accountJson from './account.json';
import catalogJson from './catalog.json';
import copyJson from './copy.json';
import type { SampleAccount, SampleCatalog } from './sample-types';

const catalog = catalogJson as unknown as SampleCatalog;
const account = accountJson as unknown as SampleAccount;

const bookIds = new Set(catalog.books.map((b) => b.id));
const slugs = new Set(catalog.books.map((b) => b.slug));
const isCents = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0;

describe('sample catalog', () => {
  it('has the 8 genres from PLAN.md section 7 in order', () => {
    expect(catalog.genres.map((g) => g.name)).toEqual([
      'Poetry',
      'Fiction',
      'Fantasy',
      'Self-help',
      'Money',
      'Food and travel',
      'Faith',
      'Art and design',
    ]);
  });

  it('has unique book ids and slugs', () => {
    expect(bookIds.size).toBe(catalog.books.length);
    expect(slugs.size).toBe(catalog.books.length);
  });

  it('resolves every author and genre reference', () => {
    const authors = new Set(catalog.authors.map((a) => a.id));
    const genres = new Set(catalog.genres.map((g) => g.id));
    for (const b of catalog.books) {
      expect(authors.has(b.authorId), `${b.slug} author`).toBe(true);
      expect(genres.has(b.genreId), `${b.slug} genre`).toBe(true);
    }
  });

  it('stores prices as integer cents', () => {
    for (const b of catalog.books) {
      expect(isCents(b.buyPriceCents), `${b.slug} buy`).toBe(true);
      expect(isCents(b.rentWeekCents), `${b.slug} rent`).toBe(true);
    }
  });

  it('keeps ratings between 1 and 5 and covers under /assets/images/books', () => {
    for (const b of catalog.books) {
      expect(b.ratingAvg).toBeGreaterThanOrEqual(1);
      expect(b.ratingAvg).toBeLessThanOrEqual(5);
      expect(b.coverPath).toBe(`/assets/images/books/${b.slug}.jpg`);
    }
  });

  it('sells every book as an ebook', () => {
    expect(new Set(catalog.books.map((b) => b.fileFormat))).toEqual(new Set(['EPUB']));
  });

  it('flags every book with invented values and only lists real field names', () => {
    const fields = new Set(Object.keys(catalog.books[0]));
    for (const b of catalog.books) {
      if (b.placeholderFields?.length) expect(b.placeholder, b.slug).toBe(true);
      for (const f of b.placeholderFields ?? [])
        expect(fields.has(f), `${b.slug}: ${f}`).toBe(true);
    }
  });

  it('keeps the design values for Your Soul is a River', () => {
    const soul = catalog.books.find((b) => b.slug === 'your-soul-is-a-river')!;
    expect(soul).toMatchObject({
      title: 'Your Soul is a River',
      pages: 160,
      year: 2016,
      publisher: 'Thought Catalog Books',
      buyPriceCents: 2999,
      rentWeekCents: 299,
      ratingAvg: 4.5,
      ratingCount: 10000,
    });
    expect(soul.placeholderFields).toEqual(['createdAt']);
  });

  it('points every rail and review at real books', () => {
    const { rails } = catalog;
    const railSlugs = [
      ...rails.heroCovers,
      rails.staffPickOfTheWeek,
      ...rails.newArrivals,
      ...rails.recommended,
      ...rails.bestSellers,
      ...Object.keys(rails.readersAlsoLiked),
      ...Object.values(rails.readersAlsoLiked).flat(),
      ...rails.orderAlsoLiked,
    ];
    for (const s of railSlugs) expect(slugs.has(s), s).toBe(true);
    for (const r of catalog.reviews) expect(bookIds.has(r.bookId)).toBe(true);
  });

  it('only recommends staff picks in the Recommended rail', () => {
    for (const s of catalog.rails.recommended) {
      expect(catalog.books.find((b) => b.slug === s)!.staffPick, s).toBe(true);
    }
  });
});

describe('sample account', () => {
  it('references real books everywhere', () => {
    const refs = [
      ...account.cart.map((c) => c.bookId),
      ...account.wishlist.bookIds,
      ...account.orders.flatMap((o) => o.items.map((i) => i.bookId)),
      ...account.purchases.map((p) => p.bookId),
      ...account.rentals.map((r) => r.bookId),
    ];
    for (const id of refs) expect(bookIds.has(id), id).toBe(true);
  });

  it('keeps rental weeks between 1 and 4', () => {
    for (const c of account.cart) expect([1, 2, 3, 4]).toContain(c.weeks);
  });

  it('has order totals that add up in cents', () => {
    for (const o of account.orders) {
      const lines = o.items.reduce((sum, i) => sum + i.lineCents, 0);
      expect(lines).toBe(o.subtotalCents);
      expect(o.subtotalCents + o.taxCents - o.discountCents).toBe(o.totalCents);
      expect(o.taxCents).toBe(Math.round(o.subtotalCents * 0.13));
    }
  });

  it('has rentals that end after they start', () => {
    for (const r of account.rentals) {
      expect(new Date(r.endsAt).getTime()).toBeGreaterThan(new Date(r.startsAt).getTime());
    }
  });
});

describe('sample copy', () => {
  it('carries the exact demo banner text', () => {
    expect(copyJson.demoBanner).toBe('Demo store. Payments use Stripe test mode; no real charges.');
  });

  it('uses ebook wording, never shipping wording', () => {
    const text = JSON.stringify({ ...copyJson, _meta: undefined });
    expect(text).not.toMatch(/Ships in|Due back|Ship to this address/);
    expect(text).toContain('Read instantly in your browser');
    expect(text).toContain('Access until {date}');
  });
});
