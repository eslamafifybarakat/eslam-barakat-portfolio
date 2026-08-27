import { Injectable, inject, signal } from '@angular/core';
import { EducationRepository } from '../infrastructure/education.repository';

@Injectable({ providedIn: 'root' })
export class EducationService {
  private readonly repository = inject(EducationRepository);

  private readonly _entries = signal(this.repository.getAll());
  readonly entries = this._entries.asReadonly();
}
