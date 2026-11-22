import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Genre } from '../../../data/models';
import { GenreChips } from './genre-chips';

const GENRES: Genre[] = [
  { id: 'genre-poetry', slug: 'poetry', name: 'Poetry' },
  { id: 'genre-fiction', slug: 'fiction', name: 'Fiction' },
  { id: 'genre-fantasy', slug: 'fantasy', name: 'Fantasy' },
];

@Component({
  imports: [GenreChips],
  template: `<app-genre-chips [genres]="genres" [(selected)]="selected" />`,
})
class Host {
  genres = GENRES;
  selected = signal('');
}

describe('GenreChips', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('[role="option"]'));
    return { fixture, el, options };
  }

  it('renders a labelled horizontal listbox with All first', async () => {
    const { el, options } = await setup();
    const listbox = el.querySelector('[role="listbox"]')!;
    expect(listbox.getAttribute('aria-label')).toBe('Filter by genre');
    expect(listbox.getAttribute('aria-orientation')).toBe('horizontal');
    expect(options().map((o) => o.textContent?.trim())).toEqual([
      'All',
      'Poetry',
      'Fiction',
      'Fantasy',
    ]);
  });

  it('marks All selected by default', async () => {
    const { options } = await setup();
    expect(options().map((o) => o.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
      'false',
    ]);
  });

  it('selects a genre on click and writes the slug back', async () => {
    const { fixture, options } = await setup();
    options()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toBe('fiction');
    expect(options()[2].getAttribute('aria-selected')).toBe('true');
    expect(options()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('reflects selection changes from the parent', async () => {
    const { fixture, options } = await setup();
    fixture.componentInstance.selected.set('fantasy');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(options()[3].getAttribute('aria-selected')).toBe('true');
  });

  it('keeps a single tab stop (roving focus)', async () => {
    const { options } = await setup();
    const tabbable = options().filter((o) => o.getAttribute('tabindex') === '0');
    expect(tabbable.length).toBe(1);
  });
});
