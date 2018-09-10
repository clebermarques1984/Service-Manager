import Vue from 'vue';
import Vuex, { ActionTree, MutationTree, GetterTree, StoreOptions } from 'vuex';
import { IRootState } from './types';
import { auth } from './modules/auth';
import { user } from './modules/user';

Vue.use(Vuex);

const state: IRootState = {
  version: '1.0.0',
  layout: 'layout-default',
};

const getters: GetterTree<IRootState, IRootState> = {
  layout: (rootState: IRootState) => rootState.layout,
};

const actions: ActionTree<IRootState, IRootState> = {
  setLayout({ commit }, layout: string) {
    commit('setLayout', layout);
  },
};

const mutations: MutationTree<IRootState> = {
  setLayout(rootState: IRootState, layout: string) {
    rootState.layout = layout;
  },
};

const store: StoreOptions<IRootState> = {
  state,
  getters,
  mutations,
  actions,
  modules: {
    auth,
    user,
  },
};

export default new Vuex.Store<IRootState>(store);
