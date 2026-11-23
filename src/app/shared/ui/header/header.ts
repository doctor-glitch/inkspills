import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { CartStore } from '../../../core/cart-store';
import copy from '../../../data/sample/copy.json';
import { Icon } from '../icon/icon';

/**
 * Site header: logo, Home / Books / About us, search (goes to /books?q=), Help, Account and Cart
 * with a count badge. Below 768 px the nav sits behind a menu button and search behind an icon.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  protected readonly cart = inject(CartStore);
  protected readonly text = copy.header;
  protected readonly links = [
    { label: copy.header.nav[0], path: '/', exact: true },
    { label: copy.header.nav[1], path: '/books', exact: false },
    { label: copy.header.nav[2], path: '/about', exact: false },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.menuOpen.set(false);
        this.searchOpen.set(false);
      });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.searchOpen.set(false);
  }

  protected toggleSearch(): void {
    this.searchOpen.update((open) => !open);
    this.menuOpen.set(false);
  }

  protected search(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const q = input.value.trim();
    void this.router.navigate(['/books'], { queryParams: q ? { q } : {} });
  }
}
