import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';

@Component({
  imports: [Dialog],
  template: `
    <app-dialog heading="Log out?" [(open)]="open" [dismissible]="dismissible()">
      Your cart and rentals are saved to your account.
      <div dialog-actions>
        <button type="button" class="confirm" (click)="open.set(false)">Log out</button>
      </div>
    </app-dialog>
  `,
})
class Host {
  open = signal(false);
  dismissible = signal(true);
}

describe('Dialog', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, dialog: el.querySelector('dialog')! };
  }

  async function setOpen(fixture: Awaited<ReturnType<typeof setup>>['fixture'], open: boolean) {
    fixture.componentInstance.open.set(open);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('is closed until opened, then labelled by its heading', async () => {
    const { fixture, dialog } = await setup();
    expect(dialog.open).toBe(false);

    await setOpen(fixture, true);
    expect(dialog.open).toBe(true);
    const heading = dialog.querySelector('h2')!;
    expect(heading.textContent).toBe('Log out?');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('projects body content and actions', async () => {
    const { fixture, dialog } = await setup();
    await setOpen(fixture, true);
    expect(dialog.querySelector('.content')!.textContent).toContain('saved to your account');
    expect(dialog.querySelector('.actions button.confirm')).not.toBeNull();
  });

  it('closes on Esc (cancel) when dismissible', async () => {
    const { fixture, dialog } = await setup();
    await setOpen(fixture, true);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(dialog.open).toBe(false);
  });

  it('closes on a backdrop click but not a click inside the panel', async () => {
    const { fixture, dialog } = await setup();
    await setOpen(fixture, true);
    dialog.querySelector<HTMLElement>('.panel')!.click();
    expect(fixture.componentInstance.open()).toBe(true);
    dialog.click();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('ignores Esc and backdrop clicks when not dismissible', async () => {
    const { fixture, dialog } = await setup();
    fixture.componentInstance.dismissible.set(false);
    await setOpen(fixture, true);
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    dialog.click();
    expect(cancel.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('syncs back when the parent closes it', async () => {
    const { fixture, dialog } = await setup();
    await setOpen(fixture, true);
    dialog.querySelector<HTMLButtonElement>('button.confirm')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
  });
});
