// Types for the sample JSON files (Phase 1). Sample-only fields live here, not in the domain models.
import type {
  Author,
  Book,
  CartItem,
  Genre,
  Order,
  Profile,
  Purchase,
  Rental,
  Review,
} from '../models';

/** Marks invented values so they are easy to find and replace in step 2a. */
export interface Placeholder {
  placeholder?: boolean;
  placeholderFields?: string[];
}

/** Percentages per star, e.g. { "5": 68, "4": 21, ... }. Phase 2 computes this from reviews. */
export type RatingBreakdown = Record<'1' | '2' | '3' | '4' | '5', number>;

export type SampleBook = Book & Placeholder & { ratingBreakdown?: RatingBreakdown };

export interface SampleRails {
  heroCovers: string[];
  staffPickOfTheWeek: string;
  newArrivals: string[];
  recommended: string[];
  bestSellers: string[];
  readersAlsoLiked: Record<string, string[]>;
  orderAlsoLiked: string[];
}

export interface SampleCatalog {
  genres: Genre[];
  authors: Author[];
  books: SampleBook[];
  reviews: Review[];
  /** Book slugs for each Home rail, in design order. */
  rails: SampleRails;
}

export interface SampleBillingAddress extends Placeholder {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface SampleAccount {
  profile: Profile & Placeholder;
  billingAddress: SampleBillingAddress;
  cart: CartItem[];
  wishlist: { bookIds: string[] } & Placeholder;
  orders: Order[];
  purchases: Purchase[];
  rentals: Rental[];
}
