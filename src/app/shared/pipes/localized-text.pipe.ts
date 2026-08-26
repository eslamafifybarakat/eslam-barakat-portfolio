import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import type { LocalizedText } from '../../core/i18n/i18n.model';

/** Resolves a `{ en, ar }` domain-data record against the current language
 * — `{{ project.description | localizedText }}`. */
@Pipe({ name: 'localizedText', pure: false })
export class LocalizedTextPipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(value: LocalizedText | null | undefined): string {
    if (!value) return '';
    return value[this.language.lang()];
  }
}
