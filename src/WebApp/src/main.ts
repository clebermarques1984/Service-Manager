import Vue from 'vue';
import Vuetify from 'vuetify';
import NProgress from 'nprogress';
import axios from 'axios';
import colors from 'vuetify/es5/util/colors';
import router from './router';
import store from './store/store';
import 'babel-polyfill';
// vue components
import App from './App.vue';
// css imports
import 'vuetify/dist/vuetify.min.css';

NProgress.configure({ showSpinner: false });

axios.interceptors.request.use(
  (config: any) => {
    const authToken = store.getters['auth/authToken'];
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  },
);

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo.base,
    secondary: colors.indigo.lighten5,
    accent: colors.purple.base,
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
