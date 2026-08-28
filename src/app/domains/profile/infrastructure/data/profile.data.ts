import type { ApiResponse } from '@core/data/api-response.model';
import { readApiResponse } from '@core/data/read-api-response';
import type { Profile } from '../../domain/profile.model';
import response from './profile.json';

export const PROFILE: Profile = Object.freeze(readApiResponse(response as ApiResponse<Profile>, 'profile'));
