import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import copy from '../../../data/sample/copy.json';
import { Checkbox } from '../checkbox/checkbox';

interface FooterLink {
  label: string;
  path: string;
  fragment?: string;
}

const text = copy.footer;
const shop = text.columns[0];
const support = text.columns[1];

/**
 * Site footer: tagline, Shop and Support links, newsletter form and legal line.
 * The newsletter validates the email and shows a success message; it saves nothing (v1.0 demo).
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormField, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly text = text;
  protected readonly columns: { title: string; links: FooterLink[] }[] = [
    {
      title: shop.title,
      // New arrivals, Best sellers, Staff picks, Gift cards
      links: [
        { label: shop.links[0], path: '/books' },
        { label: shop.links[1], path: '/books' },
        { label: shop.links[2], path: '/books' },
        { label: shop.links[3], path: '/help' },
      ],
    },
    {
      title: support.title,
      // Help Center, How renting works, Press Releases, Refer and Earn
      links: [
        { label: support.links[0], path: '/help' },
        { label: support.links[1], path: '/help', fragment: 'renting' },
        { label: support.links[2], path: '/help' },
        { label: support.links[3], path: '/help' },
      ],
    },
  ];
  // Privacy, Terms, Cookies
  protected readonly legal: FooterLink[] = [
    { label: text.legal[0], path: '/privacy' },
    { label: text.legal[1], path: '/terms' },
    { label: text.legal[2], path: '/privacy', fragment: 'cookies' },
  ];

  private readonly model = signal({ email: '', promos: false, priceDrops: true });
  protected readonly newsletter = form(this.model, (p) => {
    required(p.email, { message: text.newsletter.emailRequired });
    email(p.email, { message: text.newsletter.emailInvalid });
  });
  protected readonly subscribed = signal(false);
  protected readonly emailError = computed(() => {
    const field = this.newsletter.email();
    return field.touched() ? (field.errors()[0]?.message ?? '') : '';
  });

  protected async subscribe(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.newsletter, async () => {
      // Demo: nothing is saved.
      this.subscribed.set(true);
      return undefined;
    });
  }
}
