import { Injectable } from '@angular/core';
import type { Profile } from '../domain/profile.model';
import { PROFILE } from './data/profile.data';

/** The only layer that knows the profile content's shape/source — a static
 * frozen object today, swappable for a CMS-backed HTTP adapter later
 * without the application/presentation layers noticing. */
@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  get(): Profile {
    return PROFILE;
  }
}
