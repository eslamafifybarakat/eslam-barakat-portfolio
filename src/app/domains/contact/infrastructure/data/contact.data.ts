import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { ContactRow } from '../../domain/contact-row.model';
import response from './contact.json';

interface ContactData {
  readonly rows: readonly ContactRow[];
}

const { rows } = readApiResponse(response as ApiResponse<ContactData>, 'contact');

export const CONTACT_ROWS: readonly ContactRow[] = Object.freeze(rows);
