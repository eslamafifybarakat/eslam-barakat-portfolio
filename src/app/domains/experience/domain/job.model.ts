import type { LocalizedText } from '../../../core/i18n/i18n.model';

export interface LocalizedList {
  readonly en: readonly string[];
  readonly ar: readonly string[];
}

export interface Job {
  /** Company name — kept as one bilingual-lockup string ("Talbinah — تلبينة")
   * rather than split, matching how the reference authored it. */
  readonly company: string;
  readonly when: LocalizedText;
  readonly role: LocalizedText;
  readonly meta: LocalizedText;
  readonly site?: string;
  /** First-party HTML with `<strong>` emphasis — rendered via `SafeHtmlPipe`. */
  readonly bullets: LocalizedList;
}
