import { Injectable, inject, signal } from '@angular/core';
import { ContactRepository } from '../infrastructure/contact.repository';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly repository = inject(ContactRepository);

  private readonly _rows = signal(this.repository.getAll());
  readonly rows = this._rows.asReadonly();
}
