import Vue from 'vue';
import Router from 'vue-router';
import Home from './Home.vue';
import Admin from './Admin.vue';
import Settings from './Settings.vue';
import Files from './Files.vue';
import Post from './Post.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: "首页" }
    },
    {
      path: '/post:path(/.*|)',
      name: 'Post',
      component: Post,
      meta: { title: "文章"}
    },
    {
      path: '/files/:mode(private|share):path(/.*|)',
      name: 'Files Private',
      component: Files,
      meta: { title: "文件"}
    },
    {
      path: '/files(/)?*',
      redirect: '/files/private'
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
