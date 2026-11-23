import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageMeta {
  /** Page name, e.g. "About us". The site name is appended. */
  title: string;
  description: string;
}

export const SITE_NAME = 'InkSpills';
const JSON_LD_ID = 'page-json-ld';

/** Sets the page title, meta description and structured data. Works during SSR. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** Also clears any structured data left by the previous page. */
  set({ title, description }: PageMeta): void {
    this.title.setTitle(title === SITE_NAME ? title : `${title} · ${SITE_NAME}`);
    this.meta.updateTag({ name: 'description', content: description });
    this.setJsonLd(null);
  }

  /** Writes one <script type="application/ld+json"> in the head, or removes it when null. */
  setJsonLd(data: object | null): void {
    const head = this.document.head;
    let script = head.querySelector<HTMLScriptElement>(`#${JSON_LD_ID}`);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    // Escape "<" so text in the data can never close the script tag.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }
}
