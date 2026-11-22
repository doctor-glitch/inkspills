import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastOutlet } from './toast-outlet';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    service.clear();
    vi.useRealTimers();
  });

  it('adds toasts newest first and keeps at most three', () => {
    for (const n of [1, 2, 3, 4]) service.show({ title: `Toast ${n}` });
    expect(service.toasts().map((t) => t.title)).toEqual(['Toast 4', 'Toast 3', 'Toast 2']);
  });

  it('auto-dismisses after the duration', () => {
    service.show({ title: 'Added to cart', duration: 3000 });
    vi.advanceTimersByTime(2999);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts().length).toBe(0);
  });

  it('keeps sticky toasts until dismissed', () => {
    const id = service.show({ title: 'Sticky', duration: 0 });
    vi.advanceTimersByTime(60_000);
    expect(service.toasts().length).toBe(1);
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });
});

describe('ToastOutlet', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => TestBed.inject(ToastService).clear());

  function setup() {
    const fixture = TestBed.createComponent(ToastOutlet);
    fixture.detectChanges();
    return {
      fixture,
      el: fixture.nativeElement as HTMLElement,
      service: TestBed.inject(ToastService),
    };
  }

  it('announces toasts in a polite live region', () => {
    const { fixture, el, service } = setup();
    const region = el.querySelector('[role="status"]')!;
    expect(region.getAttribute('aria-live')).toBe('polite');

    service.show({
      title: 'Added to cart',
      message: 'Your Soul is a River, rent for 1 week',
      imageSrc: '/assets/images/books/your-soul-is-a-river.jpg',
      action: { label: 'View cart', link: '/cart' },
    });
    fixture.detectChanges();

    expect(region.querySelector('.title')!.textContent).toContain('Added to cart');
    expect(region.querySelector('.message')!.textContent).toBe(
      'Your Soul is a River, rent for 1 week',
    );
    expect(region.querySelector('img')!.getAttribute('alt')).toBe('');
    const action = region.querySelector('a.action')!;
    expect(action.textContent?.trim()).toBe('View cart');
    expect(action.getAttribute('href')).toBe('/cart');
  });

  it('dismisses with the close button', () => {
    const { fixture, el, service } = setup();
    service.show({ title: 'Added to cart' });
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('button[aria-label="Dismiss notification"]')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.toast')).toBeNull();
  });
});
