import { Injectable } from '@angular/core';
import type { SkillGroup } from '../domain/skill-group.model';
import { SKILL_GROUPS } from './data/skills.data';

@Injectable({ providedIn: 'root' })
export class SkillsRepository {
  getAll(): readonly SkillGroup[] {
    return SKILL_GROUPS;
  }
}
