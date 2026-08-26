import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

/**
 * `{{ 'portfolio_hero_lede' | translate }}` / `{{ 'portfolio_work_count' | translate: { shown, total } }}`
 * Signal-driven: re-evaluates whenever the language (or a lazily-loaded
 * catalog) changes, same as any other signal read in a template.
 */
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly translation = inject(TranslationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.translation.translate(key, params);
  }
}
