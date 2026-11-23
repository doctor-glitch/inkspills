import { Injectable } from '@angular/core';
import type { Review } from '../models';
import { ReviewService } from '../services';
import catalogJson from './catalog.json';
import type { SampleCatalog } from './sample-types';

const reviews = (catalogJson as unknown as SampleCatalog).reviews;

/** Reviews read from catalog.json (Phase 1). */
@Injectable()
export class SampleReviewService extends ReviewService {
  async listForBook(bookId: string, limit = 10): Promise<Review[]> {
    return reviews
      .filter((r) => r.bookId === bookId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
}
