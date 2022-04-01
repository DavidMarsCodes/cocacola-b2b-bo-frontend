import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Constants } from '../../constants/constants';
import { UserInfo } from '../../models/user-info.model';
import * as UserActions from '../actions/user.actions';

const getUserState = createFeatureSelector<UserInfo>('user');

export const getHomeStyle = createSelector(getUserState, (user) => {
  let currentCountry = Constants.countries.find((country) => country.key === user.countryId);
  return currentCountry?.homeStyle;
});

export const isAuthenticated = createSelector(getUserState, (user) => {
  return user && user.jwt && user.email;
});

const initialState: UserInfo = {};

export const userReducer = createReducer<UserInfo>(
  initialState,
  on(UserActions.loadUser, (state, props): UserInfo => ({ ...state, ...props.user })),
  on(UserActions.loadJwt, (state, props): UserInfo => ({ ...state, jwt: props.jwt })),
  on(UserActions.loadCpgId, (state, props): UserInfo => ({ ...state, cpgId: props.cpgId }))
);
