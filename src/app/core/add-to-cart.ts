import { Injectable, inject } from '@angular/core';
import type { AcquireMode, Book, RentalWeeks } from '../data/models';
import copy from '../data/sample/copy.json';
import { fill } from '../shared/format/fill';
import { ToastService } from '../shared/ui/toast/toast.service';
import { CartStore } from './cart-store';

/** Adds a book to the cart and shows the "Added to cart" toast with a View cart link. */
@Injectable({ providedIn: 'root' })
export class AddToCart {
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);

  async add(
    book: Pick<Book, 'id' | 'title' | 'coverPath'>,
    mode: AcquireMode,
    weeks: RentalWeeks = 1,
  ): Promise<void> {
    await this.cart.add(book.id, mode, weeks);
    const message =
      mode === 'buy'
        ? fill(copy.toast.addedBuy, { title: book.title })
        : fill(copy.toast.addedRent, {
            title: book.title,
            weeks: weeks === 1 ? '1 week' : `${weeks} weeks`,
          });
    this.toast.show({
      title: copy.toast.addedToCart,
      message,
      imageSrc: book.coverPath,
      action: { label: copy.toast.viewCart, link: '/cart' },
    });
  }
}
