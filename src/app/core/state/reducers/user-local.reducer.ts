import { createReducer, on } from '@ngrx/store';
import { CountryCodes } from '../../enums/country-codes.enum';
import * as UserLocalActions from '../actions/user-local.actions';
import { UserLocal } from './../../models/user-local.model';

const initialState: UserLocal = {};

export const userLocalReducer = createReducer<UserLocal>(
  initialState,
  on(UserLocalActions.loadGeoCountryCode, (state, props): UserLocal => ({ ...state, geoCountryCode: props.countryCode as CountryCodes })),
  on(UserLocalActions.loadOrganizationId, (state, props): UserLocal => ({ ...state, organizationId: props.organizationId })),
  on(UserLocalActions.loadCpgId, (state, props): UserLocal => ({ ...state, cpgId: props.cpgId }))
);
