import Vue from 'vue';
import NProgress from 'nprogress';
import axios from 'axios';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import VueI18n from 'vue-i18n';
import i18n from './i18n/locales';
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
    primary: colors.shades.black,
    secondary: colors.indigo.lighten5,
    accent: colors.purple.base,
  },
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
