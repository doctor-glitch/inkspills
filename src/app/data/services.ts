// Data service interfaces. Pages inject these abstract classes; a provider picks the implementation:
// sample/ in Phase 1 (provideSampleData), supabase/ in Phase 2. Every method is async so the
// Supabase versions can drop in without the pages changing.
import type {
  BookDetail,
  BookSummary,
  CartItem,
  CatalogQuery,
  Genre,
  Order,
  Profile,
  Purchase,
  RailName,
  Rental,
  Review,
  Session,
} from './models';

/** Books, authors and genres. */
export abstract class CatalogService {
  abstract listGenres(): Promise<Genre[]>;
  /** Books matching the filters, in catalog order. */
  abstract listBooks(query?: CatalogQuery): Promise<BookSummary[]>;
  /** null when no book has this slug. */
  abstract getBookBySlug(slug: string): Promise<BookDetail | null>;
  abstract getRail(name: RailName): Promise<BookSummary[]>;
  /** The Home hero's staff pick of the week. */
  abstract getStaffPick(): Promise<BookSummary>;
  /** The three covers in the Home hero, in design order. */
  abstract getHeroCovers(): Promise<BookSummary[]>;
  abstract readersAlsoLiked(slug: string): Promise<BookSummary[]>;
}

export abstract class ReviewService {
  /** Newest first. */
  abstract listForBook(bookId: string, limit?: number): Promise<Review[]>;
}

/** Loads and saves the cart. CartStore holds the live state. */
export abstract class CartService {
  abstract load(): Promise<CartItem[]>;
  abstract save(items: CartItem[]): Promise<void>;
}

export abstract class AuthService {
  /** null when signed out. */
  abstract session(): Promise<Session | null>;
  abstract signIn(email: string, password: string): Promise<Session>;
  abstract signUp(fullName: string, email: string, password: string): Promise<Session>;
  abstract signOut(): Promise<void>;
}

/** The signed-in reader's account. */
export abstract class AccountService {
  abstract profile(): Promise<Profile>;
  abstract orders(): Promise<Order[]>;
  abstract purchases(): Promise<Purchase[]>;
  abstract rentals(): Promise<Rental[]>;
  abstract wishlistIds(): Promise<string[]>;
}
