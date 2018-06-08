import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IAuthState, IRootState } from '../types';
import { ICredentials } from '@/models/credentials.interface';
import { authService } from '@/services/auth.service';
import { EventBus } from '@/event-bus';

// initial state
const state: IAuthState = {
  token: localStorage.getItem('auth-token') || '',
  status: '',
};

// computed properties for stores, will only re-evaluate when some of its dependencies have changed
const getters: GetterTree<IAuthState, IRootState> = {
  isAuthenticated: (authState: IAuthState) => !!authState.token,
  authStatus: (authState: IAuthState) => authState.status,
  authToken: (authState: IAuthState) => authState.token,
};

// can perform asynchronous operations inside an action
const actions: ActionTree<IAuthState, IRootState> = {
  authRequest: ({ commit, dispatch }, credentials: ICredentials): any => {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      authService.login(credentials).subscribe(
        (result: any) => {
          localStorage.setItem('auth-token', result); // stash the auth token in localStorage
          commit('authSuccess', result);
          EventBus.$emit('logged-in', null);
          dispatch('user/userRequest', null, { root: true });
          resolve(result);
        },
        (errors: any) => {
          commit('authError', errors);
          localStorage.removeItem('auth-token');
          reject(errors);
        },
      );
    });
  },
  authLogout: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit('authLogout');
      localStorage.removeItem('auth-token');
      resolve();
    });
  },
};

// where we perform actual state modifications
const mutations: MutationTree<IAuthState> = {
  authRequest: (authState: IAuthState) => {
    authState.status = 'attempting authentication request';
  },
  authSuccess: (authState: IAuthState, authToken: string) => {
    authState.status = 'authentication succeeded';
    authState.token = authToken;
  },
  authError: (authState: IAuthState) => {
    authState.status = 'error';
  },
  authLogout: (authState: IAuthState) => {
    authState.token = '';
  },
};

export const auth: Module<IAuthState, IRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
