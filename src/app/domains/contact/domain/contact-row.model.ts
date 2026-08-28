import type { IconName } from '@shared/ui/icon/icon.model';

export interface ContactRow {
  /** Translation catalog key for the row's label (a UI label, not
   * bilingual content — see the i18n design note in README). */
  readonly labelKey: string;
  readonly value: string;
  /** Translation key for the DISPLAYED value, when the value itself is
   * translatable content (e.g. a city name) rather than fixed contact data
   * (phone/email/URL) — `value` still carries the literal fallback/copy
   * source when this is absent. */
  readonly valueKey?: string;
  readonly href: string;
  /** Extra `rel` tokens beyond the `noopener noreferrer` every external row
   * already gets — e.g. `"me"` on rows that are this person's own verified
   * profile elsewhere (IndieWeb identity-verification convention; read by
   * Mastodon/WebFinger-style profile checks). */
  readonly rel?: string;
  readonly icon: IconName;
  /** Value reads left-to-right even inside an RTL document (phone/email/URLs). */
  readonly ltr?: boolean;
  /** Row triggers copy-to-clipboard instead of navigating. */
  readonly copy?: boolean;
}
