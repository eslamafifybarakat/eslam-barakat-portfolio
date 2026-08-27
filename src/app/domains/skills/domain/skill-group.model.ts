import type { LocalizedText } from '../../../core/i18n/i18n.model';
import type { IconName } from '../../../shared/ui/icon/icon.model';

export interface SkillGroup {
  readonly icon: IconName;
  readonly label: LocalizedText;
  /** Technology names are proper nouns, not translated — one `·`-joined
   * string shown as-is in both languages. */
  readonly technologies: readonly string[];
}
