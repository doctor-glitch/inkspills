import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CLOCK } from '../../core/clock';
import { CartStore } from '../../core/cart-store';
import { provideSampleData } from '../../data/provide-data';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { BookPage } from './book-page';

const DESIGN_NOW = new Date('2026-11-21T12:00:00.000Z');

async function setup(slug = 'your-soul-is-a-river') {
  TestBed.configureTestingModule({
    providers: [
      provideSampleData(),
      provideRouter([]),
      { provide: CLOCK, useValue: () => DESIGN_NOW },
    ],
  });
  const fixture = TestBed.createComponent(BookPage);
  fixture.componentRef.setInput('slug', slug);
  await fixture.whenStable();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, ' ').trim();

describe('BookPage', () => {
  afterEach(() => TestBed.inject(ToastService).clear());

  it('shows the breadcrumb, title, author, rating and tagline', async () => {
    const { el } = await setup();
    const crumbs = [...el.querySelectorAll('.crumbs li')];
    expect(crumbs.map(text)).toEqual(['Home', 'Poetry', 'Your Soul is a River']);
    expect(crumbs[1].querySelector('a')?.getAttribute('href')).toBe('/books?genre=poetry');
    expect(el.querySelector('h1')?.textContent).toBe('Your Soul is a River');
    expect(el.querySelector('.author')?.textContent).toBe('Nikita Gill');
    expect(el.querySelector('.byline .count')?.textContent).toBe('10k reviews');
    expect(el.querySelector('.tagline')?.textContent).toContain('A collection of poems');
  });

  it('shows the buy and rent panel with ebook copy', async () => {
    const { el } = await setup();
    const part = (option: string, cls: string) => text(el.querySelector(`${option} ${cls}`));
    expect(part('.option--buy', '.option-head')).toBe('Buy');
    expect(part('.option--buy', '.option-price')).toBe('$29.99');
    expect(part('.option--buy', '.option-note')).toBe('Yours to keep');
    expect(part('.option--rent', '.option-head')).toBe('Rent');
    expect(part('.option--rent', '.option-price')).toBe('$2.99/week');
    expect(part('.option--rent', '.option-note')).toBe('1 to 4 weeks, extend anytime');
    expect([...el.querySelectorAll('.ctas button[appButton]')].map(text)).toEqual([
      'Buy now',
      'Rent now',
    ]);
    const perks = [...el.querySelectorAll('.perks li')].map(text);
    expect(perks).toEqual([
      'Read instantly in your browser',
      'Rent credit counts toward buying',
      'Terms and conditions apply',
    ]);
    expect(el.textContent).not.toContain('Ships in');
  });

  it('highlights the option card that is picked', async () => {
    const { el, fixture } = await setup();
    expect(el.querySelector('.option--buy')?.classList).toContain('option--on');
    el.querySelector<HTMLInputElement>('input[value="rent"]')!.click();
    await fixture.whenStable();
    expect(el.querySelector('.option--rent')?.classList).toContain('option--on');
    expect(el.querySelector('.option--buy')?.classList).not.toContain('option--on');
  });

  it('Rent now adds a one-week rental and shows the added-to-cart toast', async () => {
    const { el, fixture } = await setup();
    const cart = TestBed.inject(CartStore);
    await cart.ready;
    el.querySelector<HTMLButtonElement>('button[appButton="rent"]')!.click();
    await fixture.whenStable();
    expect(cart.items().find((i) => i.bookId === 'book-your-soul-is-a-river')).toEqual({
      bookId: 'book-your-soul-is-a-river',
      mode: 'rent',
      weeks: 1,
      savedForLater: false,
    });
    expect(TestBed.inject(ToastService).toasts()[0]).toMatchObject({
      title: 'Added to cart',
      message: 'Your Soul is a River, rent for 1 week',
      imageSrc: '/assets/images/books/your-soul-is-a-river.jpg',
      action: { label: 'View cart', link: '/cart' },
    });
  });

  it('Buy now adds a purchase', async () => {
    const { el, fixture } = await setup();
    const cart = TestBed.inject(CartStore);
    el.querySelector<HTMLButtonElement>('button[appButton="buy"]')!.click();
    await fixture.whenStable();
    expect(cart.items().find((i) => i.bookId === 'book-your-soul-is-a-river')?.mode).toBe('buy');
    expect(TestBed.inject(ToastService).toasts()[0].message).toBe(
      'Your Soul is a River, buy to keep',
    );
  });

  it('shows about the book, about the author and the more information table', async () => {
    const { el } = await setup();
    const sections = [...el.querySelectorAll('.details h2')].map(text);
    expect(sections).toEqual(['About the book', 'About the author', 'More information']);
    expect(el.querySelector('.initials')?.textContent).toBe('NG');
    expect(el.querySelector('.author-role')?.textContent).toBe('Poet, playwright and illustrator');
    const rows = [...el.querySelectorAll('.more .row')].map((r) => [
      text(r.querySelector('dt')),
      text(r.querySelector('dd')),
    ]);
    expect(rows).toEqual([
      ['Pages', '160'],
      ['Genre', 'Poetry'],
      ['Year', '2016'],
      ['Publisher', 'Thought Catalog Books'],
      ['Category', 'Adult'],
      ['Format', 'EPUB'],
    ]);
  });

  it('shows the rating breakdown and the latest reviews', async () => {
    const { el } = await setup();
    expect(text(el.querySelector('.average .score'))).toBe('4.5');
    expect(text(el.querySelector('.average .of'))).toBe('out of 5, 10k reviews');
    expect([...el.querySelectorAll('.bar .pct')].map(text)).toEqual([
      '5 stars: 68%',
      '4 stars: 21%',
      '3 stars: 7%',
      '2 stars: 3%',
      '1 star: 1%',
    ]);
    const reviews = [...el.querySelectorAll('.review')];
    expect(reviews.map((r) => text(r.querySelector('.when')))).toEqual([
      'Rented, 2 weeks ago',
      'Bought, last month',
    ]);
    expect(reviews[0].querySelector('app-tag')?.className).toContain('tag--rent');
    expect(reviews[1].querySelector('app-tag')?.className).toContain('tag--buy');
    expect(text(el.querySelector('.read-all'))).toBe('Read all 10k reviews');
  });

  it('shows Readers also liked', async () => {
    const { el } = await setup();
    const rail = el.querySelector('app-book-rail')!;
    expect(rail.querySelector('h2')?.textContent).toBe('Readers also liked');
    expect(rail.querySelectorAll('app-book-card').length).toBe(5);
  });

  it('sets the title, description and book structured data', async () => {
    await setup();
    const doc = TestBed.inject(DOCUMENT);
    expect(doc.title).toBe('Your Soul is a River by Nikita Gill · InkSpills');
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'A collection of poems',
    );
    const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld).toMatchObject({
      '@type': 'Book',
      name: 'Your Soul is a River',
      author: { name: 'Nikita Gill' },
      bookFormat: 'https://schema.org/EBook',
      numberOfPages: 160,
      aggregateRating: { ratingValue: 4.5, ratingCount: 10000 },
    });
    expect(ld.offers[0]).toMatchObject({ price: '29.99', priceCurrency: 'CAD' });
    expect(ld.offers[1].priceSpecification).toMatchObject({
      price: '2.99',
      referenceQuantity: { value: 1, unitCode: 'WEE' },
    });
  });

  it('shows not found, without structured data, for an unknown slug', async () => {
    const { el } = await setup('nope');
    const doc = TestBed.inject(DOCUMENT);
    expect(el.querySelector('h1')?.textContent).toBe('Book not found');
    expect(el.querySelector('.missing a')?.getAttribute('href')).toBe('/books');
    expect(doc.title).toBe('Page not found · InkSpills');
    expect(doc.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('falls back gracefully for a book without an author bio or breakdown', async () => {
    const { el } = await setup('happy');
    expect(el.querySelector('h1')?.textContent).toBe('Happy');
    expect(el.querySelector('.bars')).toBeNull();
    expect(el.querySelectorAll('.review').length).toBe(0);
  });
});
