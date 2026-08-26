import { DOCUMENT, Injectable, inject } from '@angular/core';

const ATTR = 'data-jsonld-id';

/**
 * Injects/replaces `<script type="application/ld+json">` blocks in
 * `<head>`, keyed by an id (`'person'`, `'website'`, `'work-item-list'`,
 * `'project'`, `'breadcrumbs'`, …) so multiple structured-data blocks can
 * coexist on one page without clobbering each other, and a route that no
 * longer needs one can remove it cleanly on navigation.
 */
@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly document = inject(DOCUMENT);

  set(id: string, data: object): void {
    const existing = this.document.head.querySelector<HTMLScriptElement>(`script[${ATTR}="${id}"]`);
    const script = existing ?? this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(ATTR, id);
    script.text = JSON.stringify(data);
    if (!existing) this.document.head.appendChild(script);
  }

  remove(id: string): void {
    this.document.head.querySelector(`script[${ATTR}="${id}"]`)?.remove();
  }
}
