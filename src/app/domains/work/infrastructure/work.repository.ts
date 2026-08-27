import { Injectable } from '@angular/core';
import type { Project } from '../domain/project.model';
import { PROJECTS } from './data/work.data';

@Injectable({ providedIn: 'root' })
export class WorkRepository {
  getAll(): readonly Project[] {
    return PROJECTS;
  }

  getBySlug(slug: string): Project | undefined {
    return PROJECTS.find((p) => p.slug === slug);
  }

  getAllSlugs(): readonly string[] {
    return PROJECTS.map((p) => p.slug);
  }
}
