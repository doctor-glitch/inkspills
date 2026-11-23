import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CartStore } from '../../core/cart-store';
import { provideSampleData } from '../../data/provide-data';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Home } from './home';

async function setup() {
  TestBed.configureTestingModule({ providers: [provideSampleData(), provideRouter([])] });
  const fixture = TestBed.createComponent(Home);
  await fixture.whenStable();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('Home', () => {
  afterEach(() => TestBed.inject(ToastService).clear());

  it('sets the page title and description', async () => {
    await setup();
    const doc = TestBed.inject(DOCUMENT);
    expect(doc.title).toBe('InkSpills');
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'Buy ebooks to keep or rent them by the week',
    );
  });

  it('shows the hero with both calls to action and the cheapest prices', async () => {
    const { el } = await setup();
    expect(el.querySelector('h1')?.textContent).toBe('Explore the world of books.');
    expect([...el.querySelectorAll('.hero-actions a')].map((a) => a.getAttribute('href'))).toEqual([
      '/books',
      '/help#renting',
    ]);
    expect(el.querySelector('.from')?.textContent).toContain('Own it from $1.99');
    expect(el.querySelector('.from')?.textContent).toContain('Rent from $0.49/week');
  });

  it('shows the three hero covers and the staff pick card linking to the book', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('.hero-art img.cover').length).toBe(3);
    const pick = el.querySelector('.pick')!;
    expect(pick.getAttribute('href')).toBe('/books/your-soul-is-a-river');
    expect(pick.textContent).toContain('Staff pick this week');
    expect(pick.textContent).toContain('Your Soul is a River');
    expect(pick.querySelector('app-price-pill')?.getAttribute('aria-label')).toContain('$29.99');
  });

  it('opens the catalog for a genre chip', async () => {
    const { el, fixture } = await setup();
    const router = TestBed.inject(Router);
    const nav = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const poetry = [...el.querySelectorAll<HTMLElement>('app-genre-chips [role="option"]')].find(
      (o) => o.textContent?.trim() === 'Poetry',
    )!;
    poetry.click();
    await fixture.whenStable();
    expect(nav).toHaveBeenCalledWith(['/books'], { queryParams: { genre: 'poetry' } });
  });

  it('shows New arrivals, Recommended and Best sellers rails in order, 5 books each', async () => {
    const { el } = await setup();
    const rails = [...el.querySelectorAll('app-book-rail')];
    expect(rails.map((r) => r.querySelector('h2')?.textContent)).toEqual([
      'New arrivals',
      'Recommended books',
      'Best sellers',
    ]);
    for (const rail of rails) expect(rail.querySelectorAll('app-book-card').length).toBe(5);
    expect(rails[1].querySelectorAll('.flag').length).toBe(5); // staff pick flags
  });

  it('shows the buy and rent explainer in blue and red', async () => {
    const { el } = await setup();
    expect(el.querySelector('.explain--buy h2')?.textContent).toBe('Keep it on your shelf');
    expect(el.querySelector('.explain--buy app-tag')?.className).toContain('tag--buy');
    expect(el.querySelector('.explain--rent h2')?.textContent).toBe('Read it this week');
    expect(el.querySelector('.explain--rent app-tag')?.className).toContain('tag--rent');
  });

  it('shows the sample wishlist on the hearts', async () => {
    const { el } = await setup();
    const kinfolk = el.querySelector('button[aria-label="Save The Kinfolk Table to wishlist"]');
    expect(kinfolk?.getAttribute('aria-pressed')).toBe('true');
  });

  it('adds a book to the cart from a card and shows the toast', async () => {
    const { el, fixture } = await setup();
    const cart = TestBed.inject(CartStore);
    await cart.ready;
    el.querySelector<HTMLButtonElement>('button[aria-label="Add Harry Potter to cart"]')!.click();
    await fixture.whenStable();
    expect(cart.items().find((i) => i.bookId === 'book-harry-potter')?.mode).toBe('buy');
    expect(TestBed.inject(ToastService).toasts()[0]).toMatchObject({
      title: 'Added to cart',
      message: 'Harry Potter, buy to keep',
      action: { label: 'View cart', link: '/cart' },
    });
  });
});
