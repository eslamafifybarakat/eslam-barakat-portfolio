import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';

/** Formats a `Date`/ISO string with `Intl.DateTimeFormat` in the current
 * language's locale (`ar-EG` / `en-US`). The portfolio's own project and job
 * periods are pre-authored bilingual strings, not `Date`s (see
 * `LocalizedText`) — this pipe is for the few genuinely computed dates
 * (the footer's copyright year, JSON-LD timestamps). */
@Pipe({ name: 'localizedDate', pure: false })
export class LocalizedDatePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(
    value: Date | string | number | null | undefined,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
  ): string {
    if (value === null || value === undefined) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const locale = this.language.lang() === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
}
