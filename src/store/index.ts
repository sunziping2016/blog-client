import Vuex from 'vuex';
import Vue from 'vue';
import api from './api';
import session from './session';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    api,
    session,
    user
  }
})
