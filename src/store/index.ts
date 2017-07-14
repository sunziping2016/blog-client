import Vuex from 'vuex';
import Vue from 'vue';
import snackbar from './snackbar';
import app from './app';
import drawer from './drawer';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    snackbar,
    drawer
  }
});
