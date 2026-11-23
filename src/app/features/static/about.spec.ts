import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { About } from './about';

async function setup() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(About);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('About', () => {
  it('sets the page title and description', async () => {
    await setup();
    const doc = TestBed.inject(DOCUMENT);
    expect(doc.title).toBe('About us · InkSpills');
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'bookstore where you choose',
    );
  });

  it('shows the intro with three photos', async () => {
    const el = await setup();
    expect(el.querySelector('h1')?.textContent).toBe('About us');
    expect(el.querySelector('.lead')?.textContent).toContain('why pay full price');
    expect(el.querySelectorAll('.photos img').length).toBe(3);
  });

  it('shows the buy and rent price panels', async () => {
    const el = await setup();
    expect(el.querySelector('.price--buy h2')?.textContent).toBe('One clear price to buy');
    expect(el.querySelector('.price--rent h2')?.textContent).toBe('One weekly price to rent');
  });

  it('shows our vision and the three coming-next items', async () => {
    const el = await setup();
    expect(el.querySelector('#vision-title')?.textContent).toBe('Our vision');
    expect([...el.querySelectorAll('.next strong')].map((s) => s.textContent)).toEqual([
      'More genres',
      'Reading lists from our community',
      'A reminder before each rental ends',
    ]);
  });

  it('ends with the Find your next read band', async () => {
    const el = await setup();
    expect(el.querySelector('#cta-title')?.textContent).toBe('Find your next read');
    expect([...el.querySelectorAll('.cta a')].map((a) => a.getAttribute('href'))).toEqual([
      '/books',
      '/help',
    ]);
  });
});
