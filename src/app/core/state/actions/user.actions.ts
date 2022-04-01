import { createAction, props } from '@ngrx/store';
import { UserInfo } from '../../models/user-info.model';

export const loadUser = createAction('[User] loadUser', props<{ user: UserInfo }>());
export const loadJwt = createAction('[User] loadJwt', props<{ jwt: string }>());
export const logout = createAction('[User] logout');
export const loadCpgId = createAction('[User] loadCpgId', props<{ cpgId: string }>());
