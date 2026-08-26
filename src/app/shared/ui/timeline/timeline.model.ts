export interface TimelineItemView {
  readonly company: string;
  readonly when: string;
  readonly role: string;
  readonly meta: string;
  readonly site?: string;
  readonly siteHost?: string;
  /** Pre-resolved, first-party HTML (job bullets carry `<strong>` emphasis) —
   * rendered through `SafeHtmlPipe` by the component. */
  readonly bullets: readonly string[];
}
