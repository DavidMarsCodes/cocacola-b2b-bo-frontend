import { ActionReducer, ActionReducerMap, INIT, MetaReducer } from '@ngrx/store';
import { UserInfo } from '../models/user-info.model';
import { userReducer } from './reducers/user.reducer';
import { userLocalReducer } from './reducers/user-local.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { UserLocal } from '../models/user-local.model';
import * as UserActions from './actions/user.actions';

interface AppState {
  user: UserInfo;
  userLocal: UserLocal;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  userLocal: userLocalReducer,
};

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['user', 'userLocal'], rehydrate: true })(reducer);
}

export function logout(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action != null && action.type === UserActions.logout.type) {
      return reducer({ undefined, userLocal: state.userLocal }, { type: INIT });
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, logout];
