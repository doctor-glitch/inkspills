import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tag, type TagTone } from './tag';
import type { IconName } from '../icon/icons';

@Component({
  imports: [Tag],
  template: `<app-tag [tone]="tone()" [icon]="icon()">Expire in 10 days</app-tag>`,
})
class Host {
  tone = signal<TagTone>('rent');
  icon = signal<IconName | undefined>('clock');
}

describe('Tag', () => {
  it('renders projected text with the tone class', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('app-tag') as HTMLElement;
    expect(tag.textContent?.trim()).toBe('Expire in 10 days');
    expect(tag.classList).toContain('tag--rent');

    fixture.componentInstance.tone.set('paid');
    fixture.detectChanges();
    expect(tag.classList).toContain('tag--paid');
    expect(tag.classList).not.toContain('tag--rent');
  });

  it('shows an optional decorative icon', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-icon svg')?.getAttribute('aria-hidden')).toBe('true');

    fixture.componentInstance.icon.set(undefined);
    fixture.detectChanges();
    expect(el.querySelector('app-icon')).toBeNull();
  });
});
