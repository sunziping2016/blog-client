import Vue from 'vue';
import Router from 'vue-router';
import Hello from './Hello.vue';
import Admin from './Admin.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      meta: { title: "首页" }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: { title: "管理", requires_login: true, requires_admin: true}
    },
    { path: '*', redirect: '/' }
  ],
  mode: 'history'
});
