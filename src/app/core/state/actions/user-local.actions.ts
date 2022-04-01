import { createAction, props } from '@ngrx/store';
import { UserInfo } from '../../models/user-info.model';

export const loadGeoCountryCode = createAction('[UserLocal] loadGeoCountryCode', props<{ countryCode: string }>());
export const loadOrganizationId = createAction('[UserLocal] loadOrganizationId', props<{ organizationId: string }>());
export const loadCpgId = createAction('[UserLocal] loadCpgId', props<{ cpgId: string }>());
