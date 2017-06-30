import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';

Vue.use(VueMaterial);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

