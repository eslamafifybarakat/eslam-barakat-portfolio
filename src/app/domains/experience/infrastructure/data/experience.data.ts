import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { Job } from '../../domain/job.model';
import response from './experience.json';

interface ExperienceData {
  readonly jobs: readonly Job[];
}

const { jobs } = readApiResponse(response as ApiResponse<ExperienceData>, 'experience');

export const JOBS: readonly Job[] = Object.freeze(jobs);
