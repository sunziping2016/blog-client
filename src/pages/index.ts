import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

let Home = resolve => (<any>require).ensure(['./Home.vue'], () => resolve(require('./Home.vue')));
let Register = resolve => (<any>require).ensure(['./Register.vue'], () => resolve(require('./Register.vue')));
let NotFound = resolve => (<any>require).ensure(['./NotFound.vue'], () => resolve(require('./NotFound.vue')));
let Markdown = resolve => (<any>require).ensure(['./Markdown.vue'], () => resolve(require('./Markdown.vue')));
let Editor = resolve => (<any>require).ensure(['./Editor.vue'], () => resolve(require('./Editor.vue')));
let Settings = resolve => (<any>require).ensure(['./Settings.vue'], () => resolve(require('./Settings.vue')));

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/(index.html)?',
      name: 'home',
      component: Home,
      meta: {title: '主页'}
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {title: '注册', requiresNoLogin: true}
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {title: '设置', requiresLogin: true}
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    },
    {
      path: '/markdown',
      name: 'markdownTest',
      component: Markdown,
      meta: {title: '文章', hashOffset: true}
    },
    {
      path: '/edit',
      name: 'editorTest',
      component: Editor,
      meta: {title: '编辑', hashOffset: true, fixedHeight: true}
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior
});

function scrollBehavior(to, from, savedPosition) {
  let rootEqual = to.matched[0].components === from.matched[0].components, position: any = {};
  if (to.hash) {
    position.selector = `a[name="${to.hash.slice(1)}"]`;
    if (to.meta.hashOffset) {
      position.offset = {
        x: 0,
        y: (<any>router.app.$refs.header).$el.clientHeight,
      }
    }
  }
  if (savedPosition) {
    position.x = savedPosition.x;
    position.y = savedPosition.y;
  }
  if (rootEqual)
    return position;
  store.commit('addSavedPosition', {
    path: to.fullPath,
    position
  });
  return false;
}

export default router;
