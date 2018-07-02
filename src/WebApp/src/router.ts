import Vue, { VueConstructor } from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import store from './store/store';
// vue pages
import Login from './pages/account/Login.vue';
import Register from './pages/account/Register.vue';
import Home from './pages/Home.vue';
import Contact from './pages/Contact.vue';
import NotFound from './pages/NotFound.vue';

Vue.use(Router);

function route(
  path: string,
  component: VueConstructor<Vue>,
  requiresAuth: boolean = true,
) {
  return {
    path,
    name: component.name,
    component,
    meta: { requiresAuth },
  };
}

const router = new Router({
  mode: 'history',
  routes: [
    route('/', Home),
    route('/contact', Contact),
    route('/register', Register, false),
    route('/login', Login, false),
    {
      ...route('*', NotFound, false),
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
