import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import NProgress from 'nprogress';
import router from './router';
import store from './store/store';
import colors from 'vuetify/es5/util/colors';
import 'babel-polyfill';

import App from './App.vue';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader

NProgress.configure({ showSpinner: false });

Vue.use(Vuetify, {
  theme: {
    primary: colors.shades.black, // #3F51B5
    secondary: colors.indigo.lighten5, // #E8EAF6
    accent: colors.purple.base, // #9c27b0
  },
});

Vue.config.productionTip = false;

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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
