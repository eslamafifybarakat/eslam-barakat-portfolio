import type { IconName } from '../../../shared/ui/icon/icon.model';

export interface ContactRow {
  /** Translation catalog key for the row's label (a UI label, not
   * bilingual content — see the i18n design note in README). */
  readonly labelKey: string;
  readonly value: string;
  readonly href: string;
  readonly icon: IconName;
  /** Value reads left-to-right even inside an RTL document (phone/email/URLs). */
  readonly ltr?: boolean;
  /** Row triggers copy-to-clipboard instead of navigating. */
  readonly copy?: boolean;
}
