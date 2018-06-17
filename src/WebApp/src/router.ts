import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';

import Login from './pages/account/Login.vue';
import Register from './pages/account/Register.vue';
import Home from './pages/Home.vue';
import NotFound from './pages/NotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: NotFound,
      beforeEnter: (to: any, from: any, next: any) => {
        store.commit('setLayout', 'layout-empty');
        next();
      },
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'registrationForm',
      component: Register,
      beforeEnter: (to: any, from: any, next: any) => {
        store.commit('setLayout', 'layout-empty');
        next();
      },
    },
    {
      path: '/login',
      name: 'loginForm',
      component: Login,
      beforeEnter: (to: any, from: any, next: any) => {
        store.commit('setLayout', 'layout-empty');
        next();
      },
    },
  ],
});

router.beforeEach((to: any, from: any, next: any) => {
  store.commit('setLayout', 'layout-default');
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters['auth/isLoggedIn']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        params: { redirect: to.fullPath },
      });
    }
  }
  next(); // make sure to always call next()!
});

export default router;
