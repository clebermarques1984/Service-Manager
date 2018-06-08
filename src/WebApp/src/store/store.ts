import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './types';
import { auth } from './modules/auth';
import { user } from './modules/user';

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
  state: {
    version: '1.0.0',
  },
  mutations: {},
  actions: {},
  modules: {
    auth,
    user,
  },
};

export default new Vuex.Store<IRootState>(store);
