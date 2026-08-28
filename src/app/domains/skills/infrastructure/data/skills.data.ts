import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { SkillGroup } from '../../domain/skill-group.model';
import response from './skills.json';

interface SkillsData {
  readonly groups: readonly SkillGroup[];
}

const { groups } = readApiResponse(response as ApiResponse<SkillsData>, 'skills');

export const SKILL_GROUPS: readonly SkillGroup[] = Object.freeze(groups);
