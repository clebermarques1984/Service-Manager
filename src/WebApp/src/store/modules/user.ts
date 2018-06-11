import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IUserState, IRootState } from '../types';
import { profileService } from '@/services/profile.service';
import { accountService } from '@/services/account.service';
import IUserRegistration from '@/models/user.registration';
import IProfile from '@/models/profile';
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
      (result: IProfile) => {
        commit('userSuccess', result);
      },
      (errors: any) => {
        commit('userError');
        dispatch('auth/authLogout', null, { root: true });
      },
    );
  },
  userRegister: ({ commit }, userRegister: IUserRegistration) => {
    return new Promise((resolve, reject) => {
      commit('userRequest');
      accountService.register(userRegister).subscribe(
        (result: any) => {
          commit('userRegister');
          resolve(result);
        },
        (errors: any) => {
          commit('userError');
          reject(errors);
        },
      );
    });
  },
};

const mutations: MutationTree<IUserState> = {
  userRegister: (userState: IUserState) => {
    userState.status = 'user registration success';
  },
  userRequest: (userState: IUserState) => {
    userState.status = 'attempting request for user profile data';
  },
  userSuccess: (userState: IUserState, profile: IProfile) => {
    userState.status = 'success';
    userState.profile = profile;
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
