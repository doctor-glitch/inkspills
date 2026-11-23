import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { PlaceholderPage } from './placeholder-page';

describe('PlaceholderPage', () => {
  it('shows the heading from route data and sets the page title', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(PlaceholderPage);
    fixture.componentRef.setInput('heading', 'Cart');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Cart');
    expect(el.querySelector('p')?.textContent).toBe('This page is coming soon.');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(TestBed.inject(DOCUMENT).title).toBe('Cart · InkSpills');
  });
});

describe('routes', () => {
  it('has every route from PLAN.md section 8, all lazy-loaded', () => {
    const paths = routes.map((r) => r.path);
    for (const path of [
      '',
      'books',
      'books/:slug',
      'about',
      'login',
      'signup',
      'forgot-password',
      'auth/callback',
      'cart',
      'checkout',
      'orders/:id',
      'account/details',
      'account/purchased',
      'account/rented',
      'account/wishlist',
      'read/:slug',
      'help',
      'terms',
      'privacy',
      'rental-policy',
      '**',
    ]) {
      expect(paths, path).toContain(path);
    }
    for (const r of routes) expect(r.loadComponent, r.path).toBeTypeOf('function');
    expect(routes.at(-1)?.path).toBe('**');
  });
});
