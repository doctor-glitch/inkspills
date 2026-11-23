import { Injectable, PendingTasks, computed, inject, signal } from '@angular/core';
import type { AcquireMode, CartItem, RentalWeeks } from '../data/models';
import { CartService } from '../data/services';

/**
 * The live cart, on signals. Loads from CartService once and saves after every change.
 * One line per book: adding a book that is already in the cart updates that line.
 * Guest localStorage and the merge at login come in step 2b.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly service = inject(CartService);
  private readonly _items = signal<readonly CartItem[]>([]);

  readonly items = this._items.asReadonly();
  /** Lines in the cart, not counting saved for later. Shown on the header badge. */
  readonly count = computed(() => this._items().filter((i) => !i.savedForLater).length);
  /** Resolves once the first load has finished. */
  readonly ready: Promise<void>;

  constructor() {
    // PendingTasks makes SSR wait for the load, so the badge renders with the real count.
    const done = inject(PendingTasks).add();
    this.ready = this.service
      .load()
      .then((items) => this._items.set(items))
      .finally(done);
  }

  async add(bookId: string, mode: AcquireMode, weeks: RentalWeeks = 1): Promise<void> {
    await this.ready;
    const line: CartItem = { bookId, mode, weeks, savedForLater: false };
    this._items.update((items) =>
      items.some((i) => i.bookId === bookId)
        ? items.map((i) => (i.bookId === bookId ? line : i))
        : [...items, line],
    );
    await this.service.save([...this._items()]);
  }
}
