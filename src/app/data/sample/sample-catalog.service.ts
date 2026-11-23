import { Injectable } from '@angular/core';
import type { BookDetail, BookSummary, CatalogQuery, Genre, RailName } from '../models';
import { CatalogService } from '../services';
import catalogJson from './catalog.json';
import type { SampleBook, SampleCatalog } from './sample-types';

const catalog = catalogJson as unknown as SampleCatalog;

/** Catalog read from catalog.json (Phase 1). */
@Injectable()
export class SampleCatalogService extends CatalogService {
  private readonly authors = new Map(catalog.authors.map((a) => [a.id, a]));
  private readonly genres = new Map(catalog.genres.map((g) => [g.id, g]));
  private readonly bySlug = new Map(catalog.books.map((b) => [b.slug, b]));

  async listGenres(): Promise<Genre[]> {
    return catalog.genres;
  }

  async listBooks(query: CatalogQuery = {}): Promise<BookSummary[]> {
    const genreId = catalog.genres.find((g) => g.slug === query.genre)?.id;
    const q = query.q?.trim().toLowerCase() ?? '';
    return catalog.books
      .filter((b) => !query.genre || b.genreId === genreId)
      .filter((b) => !q || this.searchText(b).includes(q))
      .map((b) => this.summary(b));
  }

  async getBookBySlug(slug: string): Promise<BookDetail | null> {
    const b = this.bySlug.get(slug);
    if (!b) return null;
    const { placeholder, placeholderFields, ratingBreakdown, ...book } = b;
    return {
      book,
      author: this.authors.get(b.authorId)!,
      genre: this.genres.get(b.genreId)!,
      ratingBreakdown: ratingBreakdown ?? null,
    };
  }

  async getRail(name: RailName): Promise<BookSummary[]> {
    return this.slugsToSummaries(catalog.rails[name]);
  }

  async getStaffPick(): Promise<BookSummary> {
    return this.summary(this.bySlug.get(catalog.rails.staffPickOfTheWeek)!);
  }

  async getHeroCovers(): Promise<BookSummary[]> {
    return this.slugsToSummaries(catalog.rails.heroCovers);
  }

  async readersAlsoLiked(slug: string): Promise<BookSummary[]> {
    const curated = catalog.rails.readersAlsoLiked[slug];
    if (curated) return this.slugsToSummaries(curated);
    // No curated list: other books in the same genre, then best sellers, up to five.
    const book = this.bySlug.get(slug);
    if (!book) return [];
    const sameGenre = catalog.books.filter((b) => b.genreId === book.genreId).map((b) => b.slug);
    const picks = [...new Set([...sameGenre, ...catalog.rails.bestSellers])].filter(
      (s) => s !== slug,
    );
    return this.slugsToSummaries(picks.slice(0, 5));
  }

  private slugsToSummaries(slugs: readonly string[]): BookSummary[] {
    return slugs.map((s) => this.summary(this.bySlug.get(s)!));
  }

  private searchText(b: SampleBook): string {
    const author = this.authors.get(b.authorId)?.name ?? '';
    const genre = this.genres.get(b.genreId)?.name ?? '';
    return `${b.title} ${author} ${genre}`.toLowerCase();
  }

  private summary(b: SampleBook): BookSummary {
    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      authorName: this.authors.get(b.authorId)?.name ?? '',
      coverPath: b.coverPath,
      ratingAvg: b.ratingAvg,
      buyPriceCents: b.buyPriceCents,
      rentWeekCents: b.rentWeekCents,
      staffPick: b.staffPick,
    };
  }
}
