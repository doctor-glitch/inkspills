import { TestBed } from '@angular/core/testing';
import { PricePill } from './price-pill';

describe('PricePill', () => {
  function render(buyCents: number | null, rentWeekCents: number | null) {
    const fixture = TestBed.createComponent(PricePill);
    fixture.componentRef.setInput('buyCents', buyCents);
    fixture.componentRef.setInput('rentWeekCents', rentWeekCents);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the buy price and weekly rent price from cents', () => {
    const el = render(2999, 299);
    expect(el.querySelector('.half--buy')!.textContent).toContain('$29.99');
    expect(el.querySelector('.half--buy')!.textContent).toContain('buy');
    expect(el.querySelector('.half--rent')!.textContent).toContain('$2.99');
    expect(el.querySelector('.half--rent')!.textContent).toContain('/wk');
  });

  it('describes both prices in one accessible label', () => {
    const el = render(2999, 299);
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Buy for $29.99, rent for $2.99 a week');
  });

  it('omits a half when its price is null', () => {
    const el = render(null, 599);
    expect(el.querySelector('.half--buy')).toBeNull();
    expect(el.getAttribute('aria-label')).toBe('rent for $5.99 a week');
  });
});
