import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RatingStars } from './rating-stars';

@Component({
  imports: [RatingStars],
  template: `
    <app-rating-stars id="display" [value]="4.5" />
    <app-rating-stars id="compact" [value]="4.8" compact />
    <app-rating-stars id="edit" editable label="Rate this book" [(value)]="mine" />
  `,
})
class Host {
  mine = signal(0);
}

describe('RatingStars', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows five stars with fractional fill and an accessible label', () => {
    const { el } = setup();
    const row = el.querySelector('#display [role="img"]')!;
    expect(row.getAttribute('aria-label')).toBe('Rated 4.5 out of 5');
    const widths = Array.from(row.querySelectorAll<HTMLElement>('.overlay')).map(
      (o) => o.style.width,
    );
    expect(widths).toEqual(['100%', '100%', '100%', '100%', '50%']);
  });

  it('shows one star and the number in compact mode', () => {
    const { el } = setup();
    const compact = el.querySelector('#compact [role="img"]')!;
    expect(compact.getAttribute('aria-label')).toBe('Rated 4.8 out of 5');
    expect(compact.textContent?.trim()).toBe('4.8');
    expect(compact.querySelectorAll('app-icon').length).toBe(1);
  });

  it('lets the reader pick a rating with radio buttons', () => {
    const { fixture, el } = setup();
    const group = el.querySelector('#edit fieldset')!;
    expect(group.querySelector('legend')?.textContent).toBe('Rate this book');
    const radios = group.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios.length).toBe(5);

    radios[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.mine()).toBe(4);
    expect(group.querySelectorAll('.pick--on').length).toBe(4);
    expect(radios[3].checked).toBe(true);
  });
});
