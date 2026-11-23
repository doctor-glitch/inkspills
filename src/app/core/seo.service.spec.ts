import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  function setup() {
    const seo = TestBed.inject(SeoService);
    const doc = TestBed.inject(DOCUMENT);
    const description = () =>
      doc.head.querySelector('meta[name="description"]')?.getAttribute('content');
    const jsonLd = () => doc.head.querySelector('script[type="application/ld+json"]');
    return { seo, doc, description, jsonLd };
  }

  afterEach(() => setup().seo.setJsonLd(null));

  it('sets the title with the site name and the meta description', () => {
    const { seo, doc, description } = setup();
    seo.set({ title: 'About us', description: 'Who we are.' });
    expect(doc.title).toBe('About us · InkSpills');
    expect(description()).toBe('Who we are.');
  });

  it('does not repeat the site name on Home', () => {
    const { seo, doc } = setup();
    seo.set({ title: 'InkSpills', description: 'Home' });
    expect(doc.title).toBe('InkSpills');
  });

  it('keeps a single meta description tag', () => {
    const { seo, doc } = setup();
    seo.set({ title: 'A', description: 'one' });
    seo.set({ title: 'B', description: 'two' });
    expect(doc.head.querySelectorAll('meta[name="description"]').length).toBe(1);
  });

  it('writes, replaces and removes one JSON-LD script', () => {
    const { seo, doc, jsonLd } = setup();
    seo.setJsonLd({ '@type': 'Book', name: 'One' });
    seo.setJsonLd({ '@type': 'Book', name: 'Two' });
    expect(doc.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(1);
    expect(JSON.parse(jsonLd()!.textContent!)).toEqual({ '@type': 'Book', name: 'Two' });
    seo.setJsonLd(null);
    expect(jsonLd()).toBeNull();
  });

  it('escapes "<" so data cannot close the script tag', () => {
    const { seo, jsonLd } = setup();
    seo.setJsonLd({ name: '</script><b>' });
    expect(jsonLd()!.textContent).not.toContain('</script>');
    expect(JSON.parse(jsonLd()!.textContent!).name).toBe('</script><b>');
  });

  it('clears structured data when a new page sets its meta', () => {
    const { seo, jsonLd } = setup();
    seo.setJsonLd({ name: 'Book' });
    seo.set({ title: 'About us', description: 'x' });
    expect(jsonLd()).toBeNull();
  });
});
