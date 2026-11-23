import { TestBed } from '@angular/core/testing';
import type { CartItem } from '../data/models';
import { provideSampleData } from '../data/provide-data';
import { CartService } from '../data/services';
import { CartStore } from './cart-store';

class FakeCartService extends CartService {
  saved: CartItem[][] = [];
  constructor(private items: CartItem[]) {
    super();
  }
  async load() {
    return this.items.map((i) => ({ ...i }));
  }
  async save(items: CartItem[]) {
    this.saved.push(items);
  }
}

const line = (bookId: string, savedForLater = false): CartItem => ({
  bookId,
  mode: 'buy',
  weeks: 1,
  savedForLater,
});

async function setup(items: CartItem[]) {
  const service = new FakeCartService(items);
  TestBed.configureTestingModule({ providers: [{ provide: CartService, useValue: service }] });
  const store = TestBed.inject(CartStore);
  await store.ready;
  return { store, service };
}

describe('CartStore', () => {
  it('loads items and counts lines not saved for later', async () => {
    const { store } = await setup([line('a'), line('b'), line('c', true)]);
    expect(store.items().map((i) => i.bookId)).toEqual(['a', 'b', 'c']);
    expect(store.count()).toBe(2);
  });

  it('counts the 4 active lines of the sample cart (the header badge in the design)', async () => {
    TestBed.configureTestingModule({ providers: [provideSampleData()] });
    const store = TestBed.inject(CartStore);
    await store.ready;
    expect(store.count()).toBe(4);
  });

  it('adds a new book and saves the cart', async () => {
    const { store, service } = await setup([line('a')]);
    await store.add('b', 'rent', 2);
    expect(store.items()).toEqual([
      line('a'),
      { bookId: 'b', mode: 'rent', weeks: 2, savedForLater: false },
    ]);
    expect(store.count()).toBe(2);
    expect(service.saved.at(-1)).toEqual(store.items());
  });

  it('keeps one line per book: adding again updates it and moves it out of saved for later', async () => {
    const { store } = await setup([line('a', true)]);
    expect(store.count()).toBe(0);
    await store.add('a', 'rent', 3);
    expect(store.items()).toEqual([{ bookId: 'a', mode: 'rent', weeks: 3, savedForLater: false }]);
    expect(store.count()).toBe(1);
  });

  it('defaults rentals to one week', async () => {
    const { store } = await setup([]);
    await store.add('a', 'rent');
    expect(store.items()[0].weeks).toBe(1);
  });
});
