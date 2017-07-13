import Vuex from 'vuex';
import Vue from 'vue';
import ui from './ui';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui
  }
});
