import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

async function setup() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(Footer);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const email = () => el.querySelector<HTMLInputElement>('#newsletter-email')!;
  const type = async (value: string) => {
    email().value = value;
    email().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const submit = async () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };
  return { fixture, el, email, type, submit };
}

describe('Footer', () => {
  it('shows the Shop and Support columns with their links', async () => {
    const { el } = await setup();
    const cols = [...el.querySelectorAll('nav.col')].map((n) => ({
      title: n.querySelector('h2')?.textContent?.trim(),
      links: [...n.querySelectorAll('a')].map((a) => a.textContent?.trim()),
    }));
    expect(cols).toEqual([
      { title: 'Shop', links: ['New arrivals', 'Best sellers', 'Staff picks', 'Gift cards'] },
      {
        title: 'Support',
        links: ['Help Center', 'How renting works', 'Press Releases', 'Refer and Earn'],
      },
    ]);
    const renting = [...el.querySelectorAll('a')].find((a) => a.textContent?.includes('renting'));
    expect(renting?.getAttribute('href')).toBe('/help#renting');
  });

  it('shows the copyright and legal links', async () => {
    const { el } = await setup();
    expect(el.querySelector('.legal p')?.textContent).toBe(
      'Copyright © 2026 InkSpills. All rights reserved.',
    );
    expect([...el.querySelectorAll('.legal a')].map((a) => a.getAttribute('href'))).toEqual([
      '/privacy',
      '/terms',
      '/privacy#cookies',
    ]);
  });

  it('has the two newsletter checkboxes, price drops ticked as drawn', async () => {
    const { el } = await setup();
    const boxes = [...el.querySelectorAll<HTMLInputElement>('app-checkbox input')];
    expect(boxes.map((b) => b.closest('app-checkbox')?.textContent?.trim())).toEqual([
      'Include promotional offers',
      'Include price drops',
    ]);
    expect(boxes.map((b) => b.checked)).toEqual([false, true]);
  });

  it('asks for an email when submitted empty', async () => {
    const { el, submit, email } = await setup();
    await submit();
    expect(el.querySelector('.error')?.textContent).toBe('Enter your email.');
    expect(email().getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('.success')).toBeNull();
  });

  it('rejects an incomplete email address', async () => {
    const { el, type, submit } = await setup();
    await type('alex.morgan@');
    await submit();
    expect(el.querySelector('.error')?.textContent).toBe(
      'Enter a full email address, like name@example.com.',
    );
  });

  it('shows a success message for a valid email', async () => {
    const { el, type, submit } = await setup();
    await type('alex.morgan@example.com');
    await submit();
    expect(el.querySelector('.success')?.textContent).toContain('Thanks for subscribing');
    expect(el.querySelector('form')).toBeNull();
  });
});
