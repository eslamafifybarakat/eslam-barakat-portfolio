import type { IconName } from '@shared/ui/icon/icon.model';

export interface EducationEntry {
  readonly icon: IconName;
  readonly titleKey: string;
  readonly placeKey: string;
  readonly whenKey: string;
}
