import { Injectable, inject, signal } from '@angular/core';
import { WorkRepository } from '../infrastructure/work.repository';
import type { Project } from '../domain/project.model';
import type { WorkFilterKey } from '../domain/work-filter.model';
import type { Lang } from '@core/i18n/i18n.model';
import { TranslationService } from '@core/i18n/translation.service';

const RELATED_LIMIT = 3;

/** Signal-based facade over the work repository, plus the filter/search
 * use-case. URL query-string sync is a presentation-layer concern (the
 * work-section/work-list-page components own `?k=&q=`); this service is
 * route-agnostic so it stays trivially testable. */
@Injectable({ providedIn: 'root' })
export class WorkService {
  private readonly repository = inject(WorkRepository);
  private readonly translation = inject(TranslationService);

  private readonly _all = signal(this.repository.getAll());
  readonly all = this._all.asReadonly();

  private readonly _filter = signal<WorkFilterKey>('all');
  private readonly _query = signal('');
  readonly filter = this._filter.asReadonly();
  readonly query = this._query.asReadonly();

  setFilter(filter: WorkFilterKey): void {
    this._filter.set(filter);
  }

  setQuery(query: string): void {
    this._query.set(query);
  }

  /** Matches the reference's `visible()` predicate exactly: filter first,
   * then a case-insensitive substring match over name + stack + the
   * CURRENT language's description + links. `lang` is always the caller's
   * current active language (see `work-section.component.ts`), so
   * resolving `descriptionKey` against it explicitly — rather than the
   * reactive `translate()` default — keeps this method pure and testable
   * with any `lang` regardless of what's currently active. */
  visibleFor(lang: Lang): Project[] {
    const filter = this._filter();
    const q = this._query().trim().toLowerCase();

    return this._all().filter((project) => {
      if (filter === 'feat' && !project.flagship) return false;
      if ((filter === 'ng' || filter === 'js') && project.kind !== filter) return false;
      if (!q) return true;
      const description = this.translation.translate(project.descriptionKey, undefined, lang);
      const haystack = `${project.name} ${project.stack.join(' ')} ${description} ${project.links.join(' ')}`;
      return haystack.toLowerCase().includes(q);
    });
  }

  getBySlug(slug: string): Project | undefined {
    return this.repository.getBySlug(slug);
  }

  /** Related work for a detail page: same kind, flagship-first, excluding
   * itself, capped at 3. */
  getRelated(project: Project): Project[] {
    return this._all()
      .filter((p) => p.slug !== project.slug && p.kind === project.kind)
      .sort((a, b) => Number(b.flagship) - Number(a.flagship))
      .slice(0, RELATED_LIMIT);
  }
}
