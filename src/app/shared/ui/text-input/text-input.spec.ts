import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { email, form, FormField, required } from '@angular/forms/signals';
import { TextInput } from './text-input';

@Component({
  imports: [TextInput],
  template: `
    <app-text-input
      label="Email"
      type="email"
      hint="We never share it."
      [error]="error()"
      [(value)]="email"
    />
  `,
})
class StandaloneHost {
  email = signal('');
  error = signal('');
}

@Component({
  imports: [TextInput, FormField],
  template: `<app-text-input label="Email" type="email" [formField]="loginForm.email" />`,
})
class SignalFormHost {
  model = signal({ email: '' });
  loginForm = form(this.model, (p) => {
    required(p.email, { message: 'Enter your email.' });
    email(p.email, { message: 'Enter a full email address, like name@example.com.' });
  });
}

@Component({
  imports: [TextInput],
  template: `<app-text-input label="Password" type="password" />`,
})
class PasswordHost {}

function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event('input'));
}

describe('TextInput', () => {
  it('links the label to the input and describes it with the hint', () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const label = el.querySelector('label')!;
    expect(label.getAttribute('for')).toBe(input.id);
    expect(label.textContent).toContain('Email');
    const hint = el.querySelector(`#${input.getAttribute('aria-describedby')}`);
    expect(hint?.textContent).toBe('We never share it.');
  });

  it('two-way binds the value', () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    type(input, 'alex@example.com');
    expect(fixture.componentInstance.email()).toBe('alex@example.com');

    fixture.componentInstance.email.set('sam@example.com');
    fixture.detectChanges();
    expect(input.value).toBe('sam@example.com');
  });

  it('shows an explicit error with aria-invalid and an alert message', () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.componentInstance.error.set('Enter a full email address, like name@example.com.');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const message = el.querySelector('[role="alert"]')!;
    expect(message.textContent).toContain('Enter a full email address');
    expect(input.getAttribute('aria-describedby')).toContain(message.id);
    expect(el.querySelector('.field--error')).not.toBeNull();
  });

  it('works with Signal Forms and only shows errors after the field is touched', async () => {
    const fixture = TestBed.createComponent(SignalFormHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;

    type(input, 'alex.morgan@');
    await fixture.whenStable();
    expect(fixture.componentInstance.model().email).toBe('alex.morgan@');
    expect(el.querySelector('[role="alert"]')).toBeNull();

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain(
      'Enter a full email address, like name@example.com.',
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');

    type(input, 'alex.morgan@example.com');
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')).toBeNull();
  });

  it('lets password fields be revealed and hidden', () => {
    const fixture = TestBed.createComponent(PasswordHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const reveal = el.querySelector('button')!;
    expect(input.type).toBe('password');
    expect(reveal.getAttribute('aria-label')).toBe('Show password');

    reveal.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(reveal.getAttribute('aria-pressed')).toBe('true');
    expect(reveal.getAttribute('aria-label')).toBe('Hide password');
  });
});
