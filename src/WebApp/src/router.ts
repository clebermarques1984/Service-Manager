import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import store from './store/store';
// vue pages
import Login from './pages/account/Login.vue';
import Register from './pages/account/Register.vue';

Vue.use(Router);

function mapRoute(
  path: string,
  component: any,
  name: string | undefined,
  requiresAuth: boolean = true,
) {
  return {
    path,
    name,
    component,
    meta: { requiresAuth },
  };
}

const router = new Router({
  mode: 'history',
  routes: [
    mapRoute('/', () => import('./pages/Home.vue'), 'Home'),
    mapRoute('/contact', () => import('./pages/contact/Index.vue'), 'Contact'),
    mapRoute(
      '/customer',
      () => import('./pages/customer/Index.vue'),
      'Customer',
    ),
    mapRoute('/register', Register, 'Register', false),
    mapRoute('/login', Login, 'Login', false),
    {
      ...mapRoute('*', () => import('@/pages/NotFound.vue'), 'NotFound', false),
      beforeEnter: (to, from, next) => {
        store.commit('setLayout', 'layout-empty');
        next();
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    store.commit('setLayout', 'layout-default');
    // Start the route progress bar.
    NProgress.start();
  }
  // check if this route requires auth
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    // check if logged in, if not, redirect to login page.
    if (!store.getters['auth/isLoggedIn']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }
  next(); // make sure to always call next()!
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
