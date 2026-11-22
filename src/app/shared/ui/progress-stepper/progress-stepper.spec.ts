import { TestBed } from '@angular/core/testing';
import { ProgressStepper } from './progress-stepper';

describe('ProgressStepper', () => {
  function render(current: number) {
    const fixture = TestBed.createComponent(ProgressStepper);
    fixture.componentRef.setInput('current', current);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { el, steps: Array.from(el.querySelectorAll('li')) };
  }

  it('renders the three purchase steps in a labelled ordered list', () => {
    const { el, steps } = render(0);
    expect(el.querySelector('ol')!.getAttribute('aria-label')).toBe('Checkout progress');
    expect(steps.map((s) => s.querySelector('.name')!.textContent!.trim())).toEqual([
      'Cart',
      'Details and payment',
      'Done',
    ]);
    expect(el.querySelectorAll('.bar').length).toBe(2);
  });

  it('marks the current step with aria-current and earlier steps as completed', () => {
    const { steps } = render(1);
    expect(steps.map((s) => s.getAttribute('aria-current'))).toEqual([null, 'step', null]);
    expect(steps[0].classList).toContain('step--done');
    expect(steps[0].textContent).toContain('(completed)');
    expect(steps[0].querySelector('app-icon')).not.toBeNull();
    expect(steps[2].querySelector('.dot')!.textContent!.trim()).toBe('3');
  });

  it('can mark every step done', () => {
    const { steps } = render(3);
    expect(steps.every((s) => s.classList.contains('step--done'))).toBe(true);
    expect(steps.some((s) => s.hasAttribute('aria-current'))).toBe(false);
  });
});
