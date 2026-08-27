import { Injectable } from '@angular/core';
import type { Job } from '../domain/job.model';
import { JOBS } from './data/experience.data';

@Injectable({ providedIn: 'root' })
export class ExperienceRepository {
  getAll(): readonly Job[] {
    return JOBS;
  }
}
