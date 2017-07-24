import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

let Home = resolve => (<any>require).ensure(['./Home.vue'], () => resolve(require('./Home.vue')));
let Register = resolve => (<any>require).ensure(['./Register.vue'], () => resolve(require('./Register.vue')));
let NotFound = resolve => (<any>require).ensure(['./NotFound.vue'], () => resolve(require('./NotFound.vue')));

Vue.use(Router);

function scrollBehavior(to, from, savedPosition) {
  let rootEqual = to.matched[0].components === from.matched[0].components, position = savedPosition;
  if (!position) {
    position = {};
    if (to.hash)
      position.selector = to.hash;
  }
  if (rootEqual)
    return position;
  store.commit('addSavedPosition', {
    path: to.fullPath,
    position
  });
  return false;
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/(index.html)?',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {requiresNoLogin: true}
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior
});

