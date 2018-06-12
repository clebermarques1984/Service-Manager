import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home.vue';
import store from './store/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'registrationForm',
      beforeEnter: (to: any, from: any, next: any) => {
        store.commit('setLayout', 'layout-register');
        next();
      },
    },
    {
      path: '/login',
      name: 'loginForm',
      beforeEnter: (to: any, from: any, next: any) => {
        store.commit('setLayout', 'layout-login');
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
    if (!store.getters['auth/isAuthenticated']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }
  next(); // make sure to always call next()!
});

export default router;
