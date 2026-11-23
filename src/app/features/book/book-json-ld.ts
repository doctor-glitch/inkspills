import type { BookDetail, Cents } from '../../data/models';

const price = (cents: Cents) => (cents / 100).toFixed(2);

/** schema.org Book structured data for a book page: an ebook with a buy offer and a weekly rent offer. */
export function bookJsonLd({ book, author, genre }: BookDetail): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: author.name },
    description: book.tagline,
    image: book.coverPath,
    url: `/books/${book.slug}`,
    genre: genre.name,
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: book.pages,
    datePublished: String(book.year),
    publisher: { '@type': 'Organization', name: book.publisher },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.ratingAvg,
      ratingCount: book.ratingCount,
      bestRating: 5,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Buy',
        price: price(book.buyPriceCents),
        priceCurrency: 'CAD',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Rent',
        businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
        priceCurrency: 'CAD',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price(book.rentWeekCents),
          priceCurrency: 'CAD',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'WEE' },
        },
      },
    ],
  };
}
