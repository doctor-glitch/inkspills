import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button, type ButtonSize, type ButtonVariant } from './button';

@Component({
  imports: [Button],
  template: `
    <button
      [appButton]="variant()"
      [size]="size()"
      [loading]="loading()"
      (click)="clicks = clicks + 1"
    >
      Buy now
    </button>
    <a appButton="secondary" href="/books">Browse</a>
  `,
})
class Host {
  variant = signal<ButtonVariant>('buy');
  size = signal<ButtonSize>('md');
  loading = signal(false);
  clicks = 0;
}

describe('Button', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, button: el.querySelector('button')!, link: el.querySelector('a')! };
  }

  it('applies variant and size classes', () => {
    const { fixture, button } = setup();
    expect(button.classList).toContain('btn--buy');
    expect(button.classList).toContain('btn--md');

    fixture.componentInstance.variant.set('rent');
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(button.classList).toContain('btn--rent');
    expect(button.classList).toContain('btn--lg');
    expect(button.classList).not.toContain('btn--buy');
  });

  it('works on links with the secondary variant', () => {
    const { link } = setup();
    expect(link.classList).toContain('btn--secondary');
    expect(link.getAttribute('href')).toBe('/books');
  });

  it('projects its label and shows a spinner with aria-busy while loading', () => {
    const { fixture, button } = setup();
    expect(button.textContent?.trim()).toBe('Buy now');
    expect(button.querySelector('.btn__spinner')).toBeNull();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.btn__spinner')).not.toBeNull();
  });

  it('keeps native click behaviour', () => {
    const { fixture, button } = setup();
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });
});
