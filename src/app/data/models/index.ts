// Domain models. Fields mirror the PLAN.md section 7 columns in camelCase.
// Money is always integer cents (CAD). Dates are ISO 8601 strings.

export type Cents = number;
export type IsoDate = string;

export type AcquireMode = 'buy' | 'rent';
/** Rentals last 1 to 4 weeks. */
export type RentalWeeks = 1 | 2 | 3 | 4;
export const RENTAL_WEEK_OPTIONS: readonly RentalWeeks[] = [1, 2, 3, 4];

export interface Genre {
  id: string;
  slug: string;
  name: string;
}

export interface Author {
  id: string;
  name: string;
  initials: string;
  roleLine: string | null;
  bio: string | null;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  authorId: string;
  genreId: string;
  tagline: string;
  about: string;
  pages: number;
  year: number;
  publisher: string;
  category: string;
  fileFormat: string;
  buyPriceCents: Cents;
  rentWeekCents: Cents;
  /** Public path of the cover image, e.g. /assets/images/books/happy.jpg */
  coverPath: string;
  ratingAvg: number;
  ratingCount: number;
  staffPick: boolean;
  createdAt: IsoDate;
}

/** What a book card needs: a book plus its author's display name. */
export interface BookSummary extends Pick<
  Book,
  | 'id'
  | 'slug'
  | 'title'
  | 'coverPath'
  | 'ratingAvg'
  | 'buyPriceCents'
  | 'rentWeekCents'
  | 'staffPick'
> {
  authorName: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  /** Display name, e.g. "Priya S." */
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  acquired: 'bought' | 'rented';
  createdAt: IsoDate;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: IsoDate | null;
  phone: string | null;
  rentalReminders: boolean;
  createdAt: IsoDate;
}

export interface CartItem {
  bookId: string;
  mode: AcquireMode;
  weeks: RentalWeeks;
  savedForLater: boolean;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  bookId: string;
  mode: AcquireMode;
  weeks: RentalWeeks | null;
  unitCents: Cents;
  lineCents: Cents;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotalCents: Cents;
  taxCents: Cents;
  discountCents: Cents;
  totalCents: Cents;
  cardLast4: string | null;
  items: OrderItem[];
  createdAt: IsoDate;
}

export interface Purchase {
  userId: string;
  bookId: string;
  orderId: string;
  paidCents: Cents;
  purchasedAt: IsoDate;
}

export type RentalStatus = 'active' | 'returned' | 'converted' | 'expired';

export interface Rental {
  id: string;
  userId: string;
  bookId: string;
  orderId: string;
  startsAt: IsoDate;
  endsAt: IsoDate;
  paidCents: Cents;
  status: RentalStatus;
}
