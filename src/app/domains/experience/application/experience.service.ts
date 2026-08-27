import { Injectable, inject, signal } from '@angular/core';
import { ExperienceRepository } from '../infrastructure/experience.repository';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly repository = inject(ExperienceRepository);

  private readonly _jobs = signal(this.repository.getAll());
  readonly jobs = this._jobs.asReadonly();
}
