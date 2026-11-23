import { Injectable } from '@angular/core';
import type { Order, Profile, Purchase, Rental } from '../models';
import { AccountService } from '../services';
import accountJson from './account.json';
import type { SampleAccount } from './sample-types';

const account = accountJson as unknown as SampleAccount;

/** The sample reader's account from account.json (Phase 1). */
@Injectable()
export class SampleAccountService extends AccountService {
  async profile(): Promise<Profile> {
    const { placeholder, placeholderFields, ...profile } = account.profile;
    return profile;
  }

  async orders(): Promise<Order[]> {
    return account.orders;
  }

  async purchases(): Promise<Purchase[]> {
    return account.purchases;
  }

  async rentals(): Promise<Rental[]> {
    return account.rentals;
  }

  async wishlistIds(): Promise<string[]> {
    return account.wishlist.bookIds;
  }
}
