import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import type { Genre } from '../../../data/models';

/** Value used for the "All" chip. */
export const ALL_GENRES = '';

/**
 * Single-select genre filter chips (All, Poetry, Fiction, ...).
 * Built on the Angular Aria listbox: one tab stop, arrow keys move between chips,
 * Enter or Space selects. `selected` holds a genre slug, or '' for All.
 */
@Component({
  selector: 'app-genre-chips',
  imports: [Listbox, Option],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul
      ngListbox
      class="chips"
      orientation="horizontal"
      focusMode="roving"
      selectionMode="explicit"
      [attr.aria-label]="label()"
      [value]="listValue()"
      (valueChange)="onChange($event)"
    >
      <li ngOption class="chip" [value]="all" label="All">All</li>
      @for (genre of genres(); track genre.id) {
        <li ngOption class="chip" [value]="genre.slug" [label]="genre.name">{{ genre.name }}</li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .chips {
      display: flex;
      gap: 0.625rem;
      margin: 0;
      padding: 0.25rem;
      list-style: none;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chips::-webkit-scrollbar {
      display: none;
    }
    .chips:focus-visible {
      outline: none;
    }
    .chip {
      flex: none;
      display: inline-flex;
      align-items: center;
      height: 2.375rem;
      padding: 0 1.0625rem;
      border: 1px solid var(--color-line);
      border-radius: var(--radius-pill);
      background: var(--color-white);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--color-slate);
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      transition:
        background-color var(--duration-fast) var(--ease-out),
        color var(--duration-fast) var(--ease-out);
    }
    .chip:hover {
      border-color: var(--color-muted);
    }
    .chip[aria-selected='true'] {
      border-color: var(--color-ink);
      background: var(--color-ink);
      color: var(--color-white);
    }
    .chip:focus-visible {
      outline: none;
      box-shadow:
        var(--focus-ring),
        0 0 0 1px var(--color-blue);
    }
  `,
})
export class GenreChips {
  readonly genres = input.required<readonly Genre[]>();
  /** Selected genre slug, or '' for All. */
  readonly selected = model<string>(ALL_GENRES);
  readonly label = input('Filter by genre');

  protected readonly all = ALL_GENRES;
  protected readonly listValue = computed(() => [this.selected()]);

  protected onChange(values: string[]): void {
    // A single-select listbox can be cleared by toggling; treat that as "All".
    this.selected.set(values[0] ?? ALL_GENRES);
  }
}
