import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Icon from 'vue-awesome/components/Icon.vue';
import FastClick from 'fastclick';
import App from './App.vue';
import components from './components';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';

FastClick.attach(document.body);
sync(store, router);
Vue.use(Vuetify);
Vue.component('icon', Icon);
Object.keys(components).forEach(x => Vue.component(x, components[x]));


let app = new Vue({
  router,
  store,
  ...(App as any)
});

router.onReady(() => app.$mount('#app'));
