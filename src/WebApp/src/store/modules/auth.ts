import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IAuthState, IRootState } from '../types';
import ICredentials from '@/models/credentials';
import { authService } from '@/services/auth.service';
import { EventBus } from '@/event-bus';
import IAuth from '@/models/auth';
import router from '@/router';

const TOKEN: string = 'auth_token';

// initial state
const state: IAuthState = (() => {
  const local: IAuth = JSON.parse(localStorage.getItem(TOKEN) || 'null');
  return {
    auth_token: local && local.auth_token,
    expires_in: local && local.expires_in,
    status: '',
  };
})(); // JSON.parse(localStorage.getItem(TOKEN) || 'null');

// computed properties for stores, will only re-evaluate when some of its dependencies have changed
const getters: GetterTree<IAuthState, IRootState> = {
  isLoggedIn: (authState: IAuthState) => {
    if (!!authState.auth_token && !!authState.expires_in) {
      const now = new Date().getTime();
      return now <= authState.expires_in;
    }
    return false;
  },
  authStatus: (authState: IAuthState) => authState.status,
  authToken: (authState: IAuthState) => authState.auth_token,
};

// can perform asynchronous operations inside an action
const actions: ActionTree<IAuthState, IRootState> = {
  authRequest: async ({ commit, dispatch }, credentials: ICredentials) => {
    try {
      const res = (await authService.login(credentials)) as IAuth;
      const expiresIn = res.expires_in;
      res.expires_in = new Date().getTime() + res.expires_in;
      commit('authSuccess', res);
      EventBus.$emit('logged-in', null);
      dispatch('user/userRequest', null, { root: true });
      dispatch('setLogoutTimer', expiresIn);
      return res;
    } catch (error) {
      commit('authError', error);
      dispatch('authLogout');
      throw error;
    }
  },
  tryAutoLogin: ({ commit }) => {
    const authToken = localStorage.getItem(TOKEN);
    if (!!authToken) {
      const token: IAuth = JSON.parse(authToken);
      commit('tryAutoLogin', token);
    }
  },
  authLogout: ({ commit }) => {
    commit('authLogout');
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
    localStorage.setItem(TOKEN, JSON.stringify(token)); // stash the token in localStorage
    authState.auth_token = token.auth_token;
    authState.expires_in = token.expires_in;
    authState.status = 'authentication succeeded';
  },
  tryAutoLogin: (authState: IAuthState, token: IAuth) => {
    authState.auth_token = token.auth_token;
    authState.expires_in = token.expires_in;
    authState.status = 'authentication succeeded';
  },
  authError: (authState: IAuthState) => {
    authState.status = 'error';
  },
  authLogout: (authState: IAuthState) => {
    localStorage.removeItem(TOKEN);
    authState.auth_token = '';
    authState.expires_in = 0;
  },
};

export const auth: Module<IAuthState, IRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
