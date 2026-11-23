import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CartStore } from '../../../core/cart-store';
import { provideSampleData } from '../../../data/provide-data';
import { Header } from './header';

@Component({ template: '' })
class Blank {}

async function setup(url = '/') {
  TestBed.configureTestingModule({
    providers: [
      provideSampleData(),
      provideRouter([
        { path: '', component: Blank },
        { path: 'books', component: Blank },
        { path: 'about', component: Blank },
      ]),
    ],
  });
  const router = TestBed.inject(Router);
  await router.navigateByUrl(url);
  const fixture = TestBed.createComponent(Header);
  await TestBed.inject(CartStore).ready;
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  return { fixture, el, router };
}

const activeLinks = (el: HTMLElement) =>
  [...el.querySelectorAll('.nav-link--active')].map((a) => a.textContent?.trim());

describe('Header', () => {
  it('shows the logo, the three nav links, Account and Cart', async () => {
    const { el } = await setup();
    expect(el.querySelector('.logo img')?.getAttribute('src')).toBe('/assets/logo.svg');
    expect([...el.querySelectorAll('.nav-link')].map((a) => a.textContent?.trim())).toEqual([
      'Home',
      'Books',
      'About us',
    ]);
    expect(el.querySelector('a[href="/account/details"]')?.textContent).toContain('Account');
    expect(el.querySelector('a[href="/cart"]')?.textContent).toContain('Cart');
  });

  it('marks only Home active on /', async () => {
    const { el } = await setup('/');
    expect(activeLinks(el)).toEqual(['Home']);
    expect(el.querySelector('.nav-link--active')?.getAttribute('aria-current')).toBe('page');
  });

  it('marks Books active on /books, including with a query string', async () => {
    const { el } = await setup('/books?genre=poetry');
    expect(activeLinks(el)).toEqual(['Books']);
  });

  it('shows the cart count from CartStore and updates it', async () => {
    const { el, fixture } = await setup();
    const badge = () => el.querySelector('.badge')?.textContent?.trim();
    expect(badge()).toBe('4');
    expect(el.querySelector('a[href="/cart"]')?.getAttribute('aria-label')).toBe('Cart, 4 items');
    await TestBed.inject(CartStore).add('book-harry-potter', 'buy');
    await fixture.whenStable();
    expect(badge()).toBe('5');
  });

  it('searches by going to /books?q=', async () => {
    const { el, router, fixture } = await setup();
    const input = el.querySelector<HTMLInputElement>('#site-search-q')!;
    input.value = '  milk ';
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(router.url).toBe('/books?q=milk');
  });

  it('goes to /books with no query for an empty search', async () => {
    const { el, router, fixture } = await setup('/about');
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(router.url).toBe('/books');
  });

  it('toggles the mobile menu and search, one at a time', async () => {
    const { el, fixture } = await setup();
    const menuBtn = el.querySelector<HTMLButtonElement>('.menu-btn')!;
    const searchBtn = el.querySelector<HTMLButtonElement>('.search-btn')!;

    menuBtn.click();
    await fixture.whenStable();
    expect(menuBtn.getAttribute('aria-expanded')).toBe('true');
    expect(menuBtn.getAttribute('aria-label')).toBe('Close menu');
    expect(el.querySelector('.nav')?.classList).toContain('nav--open');

    searchBtn.click();
    await fixture.whenStable();
    expect(searchBtn.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('.search')?.classList).toContain('search--open');
    expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the mobile menu after navigating', async () => {
    const { el, fixture, router } = await setup();
    el.querySelector<HTMLButtonElement>('.menu-btn')!.click();
    await fixture.whenStable();
    await router.navigateByUrl('/about');
    await fixture.whenStable();
    expect(el.querySelector('.nav')?.classList).not.toContain('nav--open');
  });
});
