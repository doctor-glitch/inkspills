import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { BookSummary } from '../../../data/models';
import { MILK_AND_HONEY, PSYCHOLOGY_OF_MONEY, SOUL_RIVER } from '../../../../testing/books';
import { BookRail } from './book-rail';

@Component({
  imports: [BookRail],
  template: `
    <app-book-rail
      heading="Recommended books"
      subtitle="Picked by our staff for slow evenings."
      seeAllLink="/books"
      [seeAllQuery]="{ sort: 'staff' }"
      [books]="books"
      [wishlistIds]="wish()"
      showStaffPick
      (addToCart)="added.push($event)"
      (wishlistToggle)="toggled.push($event)"
    />
  `,
})
class Host {
  books = [SOUL_RIVER, MILK_AND_HONEY, PSYCHOLOGY_OF_MONEY];
  wish = signal<readonly string[]>([PSYCHOLOGY_OF_MONEY.id]);
  added: BookSummary[] = [];
  toggled: BookSummary[] = [];
}

describe('BookRail', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('is a labelled section with a heading, subtitle and list of cards', () => {
    const { el } = setup();
    const section = el.querySelector('section')!;
    const h2 = el.querySelector('h2')!;
    expect(h2.textContent).toBe('Recommended books');
    expect(section.getAttribute('aria-labelledby')).toBe(h2.id);
    expect(el.querySelector('.subtitle')!.textContent).toContain('slow evenings');
    expect(el.querySelectorAll('ul[role="list"] > li app-book-card').length).toBe(3);
  });

  it('links See all with an accessible name that includes the rail', () => {
    const { el } = setup();
    const link = el.querySelector('a.see-all')!;
    expect(link.getAttribute('href')).toBe('/books?sort=staff');
    expect(link.textContent?.replace(/\s+/g, ' ').trim()).toBe('See all Recommended books');
  });

  it('marks wishlisted books and passes the staff pick flag through', () => {
    const { el } = setup();
    const favs = el.querySelectorAll('.fav');
    expect(Array.from(favs).map((f) => f.getAttribute('aria-pressed'))).toEqual([
      'false',
      'false',
      'true',
    ]);
    expect(el.querySelectorAll('.flag').length).toBe(2);
  });

  it('forwards card events', () => {
    const { fixture, el } = setup();
    el.querySelectorAll<HTMLButtonElement>('.add')[1].click();
    el.querySelectorAll<HTMLButtonElement>('.fav')[0].click();
    expect(fixture.componentInstance.added).toEqual([MILK_AND_HONEY]);
    expect(fixture.componentInstance.toggled).toEqual([SOUL_RIVER]);
  });

  it('scrolls the track with named previous and next buttons and disables them at the ends', () => {
    const { fixture, el } = setup();
    const track = el.querySelector<HTMLElement>('.track')!;
    Object.defineProperty(track, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(track, 'scrollWidth', { value: 1000, configurable: true });
    const [prev, next] = Array.from(el.querySelectorAll<HTMLButtonElement>('.arrow'));
    expect(prev.getAttribute('aria-label')).toBe('Previous Recommended books');
    expect(next.getAttribute('aria-label')).toBe('Next Recommended books');

    track.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    track.scrollLeft = 500;
    track.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });
});
