import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Toggle } from './toggle';

@Component({
  imports: [Toggle],
  template: `
    <app-toggle [(checked)]="on" [disabled]="disabled()" describedBy="reminder-help">
      Rental reminders
    </app-toggle>
    <p id="reminder-help">Email me two days before a rental ends.</p>
  `,
})
class Host {
  on = signal(true);
  disabled = signal(false);
}

describe('Toggle', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, sw: el.querySelector('[role="switch"]') as HTMLButtonElement };
  }

  it('is an accessible switch named by its label', () => {
    const { el, sw } = setup();
    expect(sw.tagName).toBe('BUTTON');
    expect(sw.getAttribute('aria-checked')).toBe('true');
    const label = el.querySelector(`#${sw.getAttribute('aria-labelledby')}`);
    expect(label?.textContent?.trim()).toBe('Rental reminders');
    expect(sw.getAttribute('aria-describedby')).toBe('reminder-help');
  });

  it('flips its state on click', () => {
    const { fixture, sw } = setup();
    sw.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.on()).toBe(false);
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('does nothing when disabled', () => {
    const { fixture, sw } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(sw.disabled).toBe(true);
    sw.click();
    expect(fixture.componentInstance.on()).toBe(true);
  });
});
