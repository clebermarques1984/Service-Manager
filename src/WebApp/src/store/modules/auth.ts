import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IAuthState, IRootState } from '../types';
import ICredentials from '@/models/credentials';
import { authService } from '@/services/auth.service';
import { EventBus } from '@/event-bus';
import IAuth from '@/models/auth';
import router from '@/router';

const TOKEN: string = 'auth_token';
const EXPIRES: string = 'expires_in';
const AUTHID: string = 'auth_id';

// initial state
const state: IAuthState = {
  token: localStorage.getItem(TOKEN) || '',
  expiresIn: localStorage.getItem(EXPIRES) || '',
  status: '',
};

// computed properties for stores, will only re-evaluate when some of its dependencies have changed
const getters: GetterTree<IAuthState, IRootState> = {
  isAuthenticated: (authState: IAuthState) => {
    if (!!authState.token && !!authState.expiresIn) {
      const now = new Date().getTime();
      return now <= Number.parseInt(authState.expiresIn);
    }
    return false;
  },
  authStatus: (authState: IAuthState) => authState.status,
  authToken: (authState: IAuthState) => authState.token,
};

// can perform asynchronous operations inside an action
const actions: ActionTree<IAuthState, IRootState> = {
  authRequest: ({ commit, dispatch }, credentials: ICredentials): any => {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      authService.login(credentials).subscribe(
        (result: IAuth) => {
          const expiresIn = result.expires_in;
          result.expires_in = new Date().getTime() + result.expires_in;
          commit('authSuccess', result);
          EventBus.$emit('logged-in', null);
          dispatch('user/userRequest', null, { root: true });
          dispatch('setLogoutTimer', expiresIn);
          resolve(result);
        },
        (errors: any) => {
          commit('authError', errors);
          dispatch('authLogout');
          reject(errors);
        },
      );
    });
  },
  tryAutoLogin: ({ commit }) => {
    const authId = localStorage.getItem(AUTHID);
    const authToken = localStorage.getItem(TOKEN);
    const expiresIn = localStorage.getItem(EXPIRES);
    if (!!authToken && !!expiresIn) {
      const token: IAuth = {
        id: authId || '',
        auth_token: authToken,
        expires_in: Number.parseInt(expiresIn),
      };
      commit('tryAutoLogin', token);
    }
  },
  authLogout: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit('authLogout');
      resolve();
    });
  },
  setLogoutTimer: ({ dispatch }, expiresIn: number) => {
    setTimeout(() => {
      dispatch('authLogout');
      router.replace('/login');
    }, expiresIn);
  },
};

// where we perform actual state modifications
const mutations: MutationTree<IAuthState> = {
  authRequest: (authState: IAuthState) => {
    authState.status = 'attempting authentication request';
  },
  authSuccess: (authState: IAuthState, token: IAuth) => {
    localStorage.setItem(AUTHID, token.id);
    localStorage.setItem(TOKEN, token.auth_token); // stash the auth token in localStorage
    localStorage.setItem(EXPIRES, token.expires_in.toString()); // stash the expires_in in localStorage
    authState.token = token.auth_token;
    authState.expiresIn = token.expires_in.toString();
    authState.status = 'authentication succeeded';
  },
  tryAutoLogin: (authState: IAuthState, token: IAuth) => {
    authState.token = token.auth_token;
    authState.expiresIn = token.expires_in.toString();
    authState.status = 'authentication succeeded';
  },
  authError: (authState: IAuthState) => {
    authState.status = 'error';
  },
  authLogout: (authState: IAuthState) => {
    localStorage.removeItem(AUTHID);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRES);
    authState.token = '';
    authState.expiresIn = '';
  },
};

export const auth: Module<IAuthState, IRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
