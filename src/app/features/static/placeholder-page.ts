import { ChangeDetectionStrategy, Component, type OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import copy from '../../data/sample/copy.json';
import { Button } from '../../shared/ui/button/button';

/**
 * Stand-in for screens built in later steps (1c, 1d) and the 404 page.
 * The route passes `heading` (and optionally `body`) as route data.
 */
@Component({
  selector: 'app-placeholder-page',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <h1 class="h1">{{ heading() }}</h1>
      <p class="text-slate">{{ body() || text.body }}</p>
      <a appButton="secondary" routerLink="/">{{ text.home }}</a>
    </section>
  `,
  styles: `
    .page {
      max-width: calc(var(--container-max) + 2 * var(--gutter));
      margin: 0 auto;
      padding: var(--space-16) var(--gutter) var(--space-20);
    }
    h1 {
      margin: 0 0 var(--space-3);
    }
    p {
      margin: 0 0 var(--space-8);
    }
  `,
})
export class PlaceholderPage implements OnInit {
  /** From route data. */
  readonly heading = input.required<string>();
  readonly body = input('');
  protected readonly text = copy.placeholderPage;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({ title: this.heading(), description: copy.seo.placeholder.description });
  }
}
