import type { LocalizedText } from '../../../core/i18n/i18n.model';
import type { IconName } from '../../../shared/ui/icon/icon.model';

export interface Pillar {
  readonly icon: IconName;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
}

export interface ProfileStats {
  readonly years: number;
  readonly yearsSuffix: string;
  readonly projects: number;
  readonly languages: number;
}

export interface Profile {
  readonly aboutParagraphs: readonly LocalizedText[];
  readonly pillars: readonly Pillar[];
  readonly stats: ProfileStats;
}
