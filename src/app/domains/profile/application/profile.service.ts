import { Injectable, inject, signal } from '@angular/core';
import { ProfileRepository } from '../infrastructure/profile.repository';

/** Signal-based application-layer facade over the profile repository —
 * components depend on this, never on the repository directly. */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly repository = inject(ProfileRepository);

  private readonly _profile = signal(this.repository.get());
  readonly profile = this._profile.asReadonly();
}
