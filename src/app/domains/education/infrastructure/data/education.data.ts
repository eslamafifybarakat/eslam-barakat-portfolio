import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { EducationEntry } from '../../domain/education-entry.model';
import response from './education.json';

interface EducationData {
  readonly entries: readonly EducationEntry[];
}

const { entries } = readApiResponse(response as ApiResponse<EducationData>, 'education');

export const EDUCATION_ENTRIES: readonly EducationEntry[] = Object.freeze(entries);
