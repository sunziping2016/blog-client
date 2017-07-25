import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Icon from 'vue-awesome/components/Icon.vue';
import FastClick from 'fastclick';
import App from './App.vue';
import components from './components';
import router from './pages';
import store from './store';
import { sync } from 'vuex-router-sync';
import feathersClient from './feathers';

FastClick.attach(document.body);
sync(store, router);
Vue.use(Vuetify);
Vue.component('icon', Icon);
Object.keys(components).forEach(x => Vue.component(x, components[x]));
if (localStorage['feathers-jwt'])
  store.dispatch('auth/authenticate', {
    strategy: 'jwt',
    accessToken: localStorage['feathers-jwt']
  }).catch(error => localStorage.removeItem('feathers-jwt'));

let app = new Vue({
  router,
  store,
  data: {
    title: "孙子平的博客"
  },
  methods: {
    updateTitle() {
      let metaTitle = this.$store.state.route.meta.title;
      if (metaTitle)
        document.title = metaTitle  + ' - ' + (<any>this).title;
      else
        document.title = (<any>this).title;
    },
  },
  mounted() {
    if (!checkRouter(this.$store.state.route))
      router.push('/');
    this.$watch('state', () => {
      if (!checkRouter(this.$store.state.route))
        router.push('/');
    });
    this.$store.dispatch('auth/authenticate').catch(error => {
      if (!error.message.includes('Could not find stored JWT'))
        this.$store.commit('snackbarAddMessage', error.message);
    });
  },
  mixins: [App]
});

function checkRouter(page) {
  let user = app.$store.state.auth.user;
  if (page.meta.requiresLogin && !user)
    return false;
  if (page.meta.requiresNoLogin && user)
    return false;
  //noinspection RedundantIfStatementJS
  if (page.meta.requiresAdmin && (!user || user.role !== 'Administrator'))
    return false;
  return true;
}

router.beforeEach((to, from, next) => {
  store.commit('addSavedPosition', {
    path: from.fullPath,
    position: {x: window.pageXOffset, y: window.pageYOffset}
  });
  store.commit('setPreviousFullPath', from.fullPath);
  if (!checkRouter(to))
    next(false);
  else
    next();
});
router.afterEach((to, from) => {
  (<any>app).updateTitle();
});
router.onReady(() => app.$mount('#app'));
(<any>window).feathersClient = feathersClient;
(<any>window).app = app;
