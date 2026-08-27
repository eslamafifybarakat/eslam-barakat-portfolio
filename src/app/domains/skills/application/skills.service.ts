import { Injectable, inject, signal } from '@angular/core';
import { SkillsRepository } from '../infrastructure/skills.repository';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private readonly repository = inject(SkillsRepository);

  private readonly _groups = signal(this.repository.getAll());
  readonly groups = this._groups.asReadonly();
}
