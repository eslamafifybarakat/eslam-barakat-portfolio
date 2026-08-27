import type { LocalizedText } from '../../../core/i18n/i18n.model';
import type { IconName } from '../../../shared/ui/icon/icon.model';

export interface EducationEntry {
  readonly icon: IconName;
  readonly title: LocalizedText;
  readonly place: LocalizedText;
  readonly when: LocalizedText;
}
