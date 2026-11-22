import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField } from '@angular/forms/signals';
import { Checkbox } from './checkbox';

@Component({
  imports: [Checkbox],
  template: `<app-checkbox [(checked)]="keep" [disabled]="disabled()"
    >Keep me signed in</app-checkbox
  >`,
})
class Host {
  keep = signal(false);
  disabled = signal(false);
}

@Component({
  imports: [Checkbox, FormField],
  template: `<app-checkbox [formField]="f.agree">I agree</app-checkbox>`,
})
class FormHost {
  model = signal({ agree: false });
  f = form(this.model);
}

describe('Checkbox', () => {
  it('labels the native checkbox with the projected text', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const label = el.querySelector('label')!;
    expect(input.type).toBe('checkbox');
    expect(label.getAttribute('for')).toBe(input.id);
    expect(label.textContent).toContain('Keep me signed in');
  });

  it('two-way binds checked and shows the tick', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('input')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.keep()).toBe(true);
    expect(el.querySelector('.box app-icon')).not.toBeNull();

    fixture.componentInstance.keep.set(false);
    fixture.detectChanges();
    expect(el.querySelector('input')!.checked).toBe(false);
    expect(el.querySelector('.box app-icon')).toBeNull();
  });

  it('can be disabled', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
  });

  it('binds to Signal Forms', async () => {
    const fixture = TestBed.createComponent(FormHost);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('input').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.model().agree).toBe(true);
  });
});
