import { Injectable } from '@angular/core';
import type { ContactRow } from '../domain/contact-row.model';
import { CONTACT_ROWS } from './data/contact.data';

@Injectable({ providedIn: 'root' })
export class ContactRepository {
  getAll(): readonly ContactRow[] {
    return CONTACT_ROWS;
  }
}
