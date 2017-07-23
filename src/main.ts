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

(<any>window).feathersClient = feathersClient;

let app = new Vue({
  router,
  store,
  ...(App as any)
});

router.onReady(() => app.$mount('#app'));
(<any>window).app = app;
