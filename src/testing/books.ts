// Test fixtures shared by component specs. Values copied from the sample catalog.
import type { BookSummary } from '../app/data/models';

export const SOUL_RIVER: BookSummary = {
  id: 'book-your-soul-is-a-river',
  slug: 'your-soul-is-a-river',
  title: 'Your Soul is a River',
  authorName: 'Nikita Gill',
  coverPath: '/assets/images/books/your-soul-is-a-river.jpg',
  ratingAvg: 4.5,
  buyPriceCents: 2999,
  rentWeekCents: 299,
  staffPick: true,
};

export const MILK_AND_HONEY: BookSummary = {
  id: 'book-milk-and-honey',
  slug: 'milk-and-honey',
  title: 'Milk and Honey',
  authorName: 'Rupi Kaur',
  coverPath: '/assets/images/books/milk-and-honey.jpg',
  ratingAvg: 4.7,
  buyPriceCents: 1199,
  rentWeekCents: 149,
  staffPick: true,
};

export const PSYCHOLOGY_OF_MONEY: BookSummary = {
  id: 'book-the-psychology-of-money',
  slug: 'the-psychology-of-money',
  title: 'The Psychology of Money',
  authorName: 'Morgan Housel',
  coverPath: '/assets/images/books/the-psychology-of-money.jpg',
  ratingAvg: 4.8,
  buyPriceCents: 499,
  rentWeekCents: 99,
  staffPick: false,
};
