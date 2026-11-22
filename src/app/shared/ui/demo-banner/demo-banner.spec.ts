import { TestBed } from '@angular/core/testing';
import { DemoBanner } from './demo-banner';

describe('DemoBanner', () => {
  it('shows the exact required demo text as a note', () => {
    const fixture = TestBed.createComponent(DemoBanner);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe(
      'Demo store. Payments use Stripe test mode; no real charges.',
    );
    expect(el.getAttribute('role')).toBe('note');
  });
});
