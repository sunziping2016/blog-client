import Vue from 'vue';
import Router from 'vue-router';
import Hello from './Hello.vue';
import Admin from './Admin.vue';
import Settings from './Settings.vue';

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
      meta: { title: "管理", requires_admin: true}
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { title: "设置", requires_login: true}
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  mode: 'history'
});
