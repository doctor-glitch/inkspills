import { Injectable } from '@angular/core';
import type { CartItem } from '../models';
import { CartService } from '../services';
import accountJson from './account.json';
import type { SampleAccount } from './sample-types';

const sampleCart = (accountJson as unknown as SampleAccount).cart;

/** Starts with the sample account's cart and keeps changes in memory (Phase 1). */
@Injectable()
export class SampleCartService extends CartService {
  private items: CartItem[] = sampleCart.map((i) => ({ ...i }));

  async load(): Promise<CartItem[]> {
    return this.items.map((i) => ({ ...i }));
  }

  async save(items: CartItem[]): Promise<void> {
    this.items = items.map((i) => ({ ...i }));
  }
}
