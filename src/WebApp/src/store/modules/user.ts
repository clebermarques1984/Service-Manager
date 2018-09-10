import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { IUserState, IRootState } from '@/store/types';
import { profileService } from '@/services/profile.service';
import { accountService } from '@/services/account.service';
import IUserRegistration from '@/models/user.registration';
import IProfile from '@/models/profile';

const state: IUserState = {
  profile: null,
  status: '',
};

const getters: GetterTree<IUserState, IRootState> = {
  profile: (userState: IUserState) => userState.profile,
};

const actions: ActionTree<IUserState, IRootState> = {
  userRequest: async ({ commit, dispatch }) => {
    commit('userRequest');
    try {
      const res = (await profileService.get()) as IProfile;
      commit('userSuccess', res);
    } catch (error) {
      commit('userError');
      dispatch('auth/authLogout', null, { root: true });
    }
  },
  userRegister: async ({ commit }, userRegister: IUserRegistration) => {
    try {
      const res = await accountService.register(userRegister);
      commit('registerSuccess');
      return res;
    } catch (error) {
      commit('userError');
      throw error;
    }
  },
};

const mutations: MutationTree<IUserState> = {
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
  registerRequest: (userState: IUserState) => {
    userState.status = 'attempting request for user registration';
  },
  registerSuccess: (userState: IUserState) => {
    userState.status = 'user registration success';
  },
};

export const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
