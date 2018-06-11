import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IUserState, IRootState } from '../types';
import { profileService } from '@/services/profile.service';
import Vue from 'vue';

const state: IUserState = {
  profile: null,
  status: '',
};

const getters: GetterTree<IUserState, IRootState> = {
  profile: (userState: IUserState) => userState.profile,
};

const actions: ActionTree<IUserState, IRootState> = {
  userRequest: ({ commit, dispatch }) => {
    commit('userRequest');
    profileService.get().subscribe(
      (result: any) => {
        commit('userSuccess', result);
      },
      (errors: any) => {
        commit('userError');
        dispatch('auth/authLogout', null, { root: true });
      },
    );
  },
};

const mutations: MutationTree<IUserState> = {
  userRegister: (userState: IUserState) => {
    userState.status = 'user registration success';
  },
  userRequest: (userState: IUserState) => {
    userState.status = 'attempting request for user profile data';
  },
  userSuccess: (userState: IUserState, userResp: any) => {
    userState.status = 'success';
    Vue.set(userState, 'profile', userResp);
  },
  userError: (userState: IUserState) => {
    userState.status = 'error';
  },
};

export const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
