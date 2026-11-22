import { TestBed } from '@angular/core/testing';
import { Icon } from './icon';
import { ICONS } from './icons';

describe('Icon', () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(Icon);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('svg') as SVGElement;
  }

  it('renders every path of the named icon at the requested size', () => {
    const svg = render({ name: 'cart', size: 20 });
    expect(svg.querySelectorAll('path').length).toBe(ICONS.cart.paths.length);
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${ICONS.cart.w} ${ICONS.cart.h}`);
  });

  it('is hidden from assistive tech unless labelled', () => {
    expect(render({ name: 'heart' }).getAttribute('aria-hidden')).toBe('true');
    const labelled = render({ name: 'heart', label: 'Add to wishlist' });
    expect(labelled.getAttribute('aria-hidden')).toBeNull();
    expect(labelled.getAttribute('role')).toBe('img');
    expect(labelled.getAttribute('aria-label')).toBe('Add to wishlist');
  });

  it('strokes outline icons and fills solid ones', () => {
    expect(render({ name: 'heart' }).querySelector('path')!.getAttribute('fill')).toBe('none');
    expect(render({ name: 'star' }).querySelector('path')!.getAttribute('fill')).toBe(
      'currentColor',
    );
    expect(render({ name: 'heart', fill: true }).querySelector('path')!.getAttribute('fill')).toBe(
      'currentColor',
    );
  });
});
