import Vue from 'vue';
import Router from 'vue-router';

/*
 * Workaround for TypeScript issue #12364
 * https://github.com/Microsoft/TypeScript/issues/12364
 */
declare global {
  interface System {
    //noinspection ReservedWordAsName
    import (request: string): Promise<any>
  }
  const System: System;
}

let Home = () => System.import('./Home.vue');
let Register = () => System.import('./Register.vue');
let NotFound = () => System.import('./NotFound.vue');

Vue.use(Router);

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
      component: Register
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});

