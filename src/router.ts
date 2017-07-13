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

let NotFound = () => System.import('@/pages/NotFound.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/(index.html)?',
      name: 'notFound',
      component: NotFound
    }
  ]
});

