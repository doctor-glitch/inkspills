import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SOUL_RIVER } from '../../../../testing/books';
import { BookCard } from './book-card';

describe('BookCard', () => {
  function render(inputs: Record<string, unknown> = {}) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', SOUL_RIVER);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows the cover, author, rating, title link and prices', () => {
    const { el } = render();
    expect(el.querySelector('img')!.getAttribute('src')).toBe(SOUL_RIVER.coverPath);
    expect(el.querySelector('.author')!.textContent).toBe('Nikita Gill');
    expect(el.querySelector('app-rating-stars')!.textContent).toContain('4.5');
    const link = el.querySelector('a.link')!;
    expect(link.textContent).toBe('Your Soul is a River');
    expect(link.getAttribute('href')).toBe('/books/your-soul-is-a-river');
    expect(el.querySelector('app-price-pill')!.getAttribute('aria-label')).toBe(
      'Buy for $29.99, rent for $2.99 a week',
    );
  });

  it('has exactly one link so screen readers hear the book once', () => {
    const { el } = render();
    expect(el.querySelectorAll('a').length).toBe(1);
  });

  it('shows the Staff pick flag only when asked and the book is a staff pick', () => {
    expect(render().el.querySelector('.flag')).toBeNull();
    TestBed.resetTestingModule();
    expect(render({ showStaffPick: true }).el.querySelector('.flag')?.textContent).toBe(
      'Staff pick',
    );
  });

  it('emits wishlist and add-to-cart events with named buttons', () => {
    const { fixture, el } = render();
    const wish = vi.fn();
    const add = vi.fn();
    fixture.componentInstance.wishlistToggle.subscribe(wish);
    fixture.componentInstance.addToCart.subscribe(add);

    const fav = el.querySelector<HTMLButtonElement>('.fav')!;
    const plus = el.querySelector<HTMLButtonElement>('.add')!;
    expect(fav.getAttribute('aria-label')).toBe('Save Your Soul is a River to wishlist');
    expect(plus.getAttribute('aria-label')).toBe('Add Your Soul is a River to cart');

    fav.click();
    plus.click();
    expect(wish).toHaveBeenCalledWith(SOUL_RIVER);
    expect(add).toHaveBeenCalledWith(SOUL_RIVER);
  });

  it('marks the heart pressed and filled when wishlisted', () => {
    const { el } = render({ wishlisted: true });
    const fav = el.querySelector('.fav')!;
    expect(fav.getAttribute('aria-pressed')).toBe('true');
    expect(fav.classList).toContain('fav--on');
  });

  it('loads lazily unless marked priority', () => {
    expect(render().el.querySelector('img')!.getAttribute('loading')).toBe('lazy');
    TestBed.resetTestingModule();
    expect(render({ priority: true }).el.querySelector('img')!.getAttribute('loading')).toBe(
      'eager',
    );
  });
});
