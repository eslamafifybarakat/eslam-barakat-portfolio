import { Injectable } from '@angular/core';
import type { EducationEntry } from '../domain/education-entry.model';
import { EDUCATION_ENTRIES } from './data/education.data';

@Injectable({ providedIn: 'root' })
export class EducationRepository {
  getAll(): readonly EducationEntry[] {
    return EDUCATION_ENTRIES;
  }
}
