import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { provideSampleData } from './data/provide-data';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideSampleData()],
    }).compileComponents();
  });

  it('shows the demo banner on every page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-demo-banner')?.textContent?.trim()).toBe(
      'Demo store. Payments use Stripe test mode; no real charges.',
    );
  });

  it('renders the router outlet inside main and a toast outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('main router-outlet')).not.toBeNull();
    expect(el.querySelector('app-toast-outlet [role="status"]')).not.toBeNull();
  });

  it('puts the demo banner above the header, and the footer after main', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const order = [...el.children].map((c) => c.tagName.toLowerCase());
    expect(order.slice(0, 4)).toEqual(['app-demo-banner', 'app-header', 'main', 'app-footer']);
  });
});
