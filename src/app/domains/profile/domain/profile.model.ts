import type { IconName } from '@shared/ui/icon/icon.model';

export interface Pillar {
  readonly icon: IconName;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

export interface ProfileStats {
  readonly years: number;
  readonly yearsSuffix: string;
  readonly projects: number;
  readonly languages: number;
}

export interface Profile {
  readonly aboutParagraphKeys: readonly string[];
  readonly pillars: readonly Pillar[];
  readonly stats: ProfileStats;
}
