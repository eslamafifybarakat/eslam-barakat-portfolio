import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import { slugify } from '@shared/utils/slugify';
import type { Project } from '../../domain/project.model';
import response from './work.json';

interface WorkData {
  readonly projects: readonly Omit<Project, 'slug'>[];
}

const { projects } = readApiResponse(response as ApiResponse<WorkData>, 'work');

export const PROJECTS: readonly Project[] = Object.freeze(
  projects.map((project) => Object.freeze({ ...project, slug: slugify(project.name) })),
);
