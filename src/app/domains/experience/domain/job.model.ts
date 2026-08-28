export interface Job {
  /** Company name — kept as one bilingual-lockup string ("Talbinah — تلبينة")
   * rather than split, matching how the reference authored it. */
  readonly company: string;
  readonly whenKey: string;
  readonly roleKey: string;
  readonly metaKey: string;
  readonly site?: string;
  /** First-party HTML with `<strong>` emphasis — rendered via `SafeHtmlPipe`.
   * Each entry is a translation key, one per bullet. */
  readonly bulletKeys: readonly string[];
}
