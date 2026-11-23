import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideSampleData } from '../../data/provide-data';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Catalog } from './catalog';

async function setup(query: { genre?: string; q?: string } = {}) {
  TestBed.configureTestingModule({ providers: [provideSampleData(), provideRouter([])] });
  const fixture = TestBed.createComponent(Catalog);
  if (query.genre) fixture.componentRef.setInput('genre', query.genre);
  if (query.q) fixture.componentRef.setInput('q', query.q);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const titles = () => [...el.querySelectorAll('app-book-card h3')].map((h) => h.textContent?.trim());
  return { fixture, el, titles };
}

describe('Catalog', () => {
  afterEach(() => TestBed.inject(ToastService).clear());

  it('lists every book with a count', async () => {
    const { el, titles } = await setup();
    expect(el.querySelector('h1')?.textContent).toBe('Books');
    expect(titles()).toHaveLength(22);
    expect(el.querySelector('.count')?.textContent).toBe('22 books');
    expect(TestBed.inject(DOCUMENT).title).toBe('Books · InkSpills');
  });

  it('filters by the genre query param and selects that chip', async () => {
    const { el, titles } = await setup({ genre: 'poetry' });
    expect(titles()).toContain('Milk and Honey');
    expect(titles()).not.toContain('Harry Potter');
    const selected = el.querySelector('app-genre-chips [aria-selected="true"]');
    expect(selected?.textContent?.trim()).toBe('Poetry');
  });

  it('searches from the q query param and titles the page with it', async () => {
    const { el, titles } = await setup({ q: 'potter' });
    expect(el.querySelector('h1')?.textContent).toBe('Results for “potter”');
    expect(titles()).toEqual(['Harry Potter']);
    expect(el.querySelector('.count')?.textContent).toBe('1 book');
    expect(TestBed.inject(DOCUMENT).title).toBe('Search: potter · InkSpills');
  });

  it('updates when the query changes', async () => {
    const { fixture, titles } = await setup({ q: 'potter' });
    fixture.componentRef.setInput('q', 'towers');
    await fixture.whenStable();
    expect(titles()).toEqual(['The Two Towers']);
  });

  it('shows an empty state with a way back to all books', async () => {
    const { el, titles } = await setup({ q: 'zzz' });
    expect(titles()).toEqual([]);
    expect(el.querySelector('.empty h2')?.textContent).toBe('No books match');
    expect(el.querySelector('.empty a')?.getAttribute('href')).toBe('/books');
  });

  it('keeps the search when a genre chip is picked', async () => {
    const { el, fixture } = await setup({ q: 'heart' });
    const nav = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    [...el.querySelectorAll<HTMLElement>('app-genre-chips [role="option"]')]
      .find((o) => o.textContent?.trim() === 'Poetry')!
      .click();
    await fixture.whenStable();
    expect(nav).toHaveBeenCalledWith(['/books'], {
      queryParams: { genre: 'poetry' },
      queryParamsHandling: 'merge',
    });
  });

  it('clears the genre filter with All', async () => {
    const { el, fixture } = await setup({ genre: 'poetry' });
    const nav = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    [...el.querySelectorAll<HTMLElement>('app-genre-chips [role="option"]')]
      .find((o) => o.textContent?.trim() === 'All')!
      .click();
    await fixture.whenStable();
    expect(nav).toHaveBeenCalledWith(['/books'], {
      queryParams: { genre: null },
      queryParamsHandling: 'merge',
    });
  });
});
