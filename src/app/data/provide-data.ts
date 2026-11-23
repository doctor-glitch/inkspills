import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SampleAccountService } from './sample/sample-account.service';
import { SampleAuthService } from './sample/sample-auth.service';
import { SampleCartService } from './sample/sample-cart.service';
import { SampleCatalogService } from './sample/sample-catalog.service';
import { SampleReviewService } from './sample/sample-review.service';
import {
  AccountService,
  AuthService,
  CartService,
  CatalogService,
  ReviewService,
} from './services';

/** Phase 1: every data service reads the sample JSON. Phase 2 adds provideSupabaseData(). */
export function provideSampleData(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: CatalogService, useClass: SampleCatalogService },
    { provide: ReviewService, useClass: SampleReviewService },
    { provide: CartService, useClass: SampleCartService },
    { provide: AuthService, useClass: SampleAuthService },
    { provide: AccountService, useClass: SampleAccountService },
  ]);
}
