const default_settings = {

};

const state = {
  uid: null,
  settings: null
};

const mutations = {
  update_login(state, uid) {
    state.uid = uid;
  },
  update_settings(state, settings) {
    state.settings = settings
  }
};

const actions = {
  async load_settings({dispatch, commit}) {
    let settings = await dispatch('ajax', {action: 'user-get-settings'});
    if (settings === null)
      settings = default_settings;
    else
      settings = JSON.parse(settings);
    commit('update_settings', settings);
  },
  async update_settings({dispatch, commit}, settings) {
    if (settings === null)
      settings = default_settings;
    commit('update_settings', settings);
    await dispatch('ajax', {action: 'user-set-settings', data: JSON.stringify(settings)});
  },
  async login({dispatch, commit}, data) {
    let uid = await dispatch('ajax', {action: 'login', data});
    if (uid) {
      commit('update_login', uid);
      await dispatch('update_user', uid);
      await dispatch('load_settings');
    }
  },
  async register({dispatch, commit}, user) {
    await dispatch('add_user', user);
    await dispatch('login', user);
  },
  async check_session({state, dispatch, commit}) {
    let uid = await dispatch('ajax', {action: 'check-session'});
    if (uid && state.uid !== uid) {
      commit('update_login', uid);
      await dispatch('update_user', uid);
      await dispatch('load_settings');
    }
  },
  async logout({state, dispatch, commit}) {
    if (state.uid === null)
      return;
    await dispatch('ajax', {action: 'logout'});
    commit('update_login', null);
  }
};

const getters = {
  logined(state) {
    return state.uid !== null;
  },
  is_admin(state, getters, rootState) {
    let uid = state.uid;
    return uid !== null && rootState.user.users[uid] && rootState.user.users[uid].role === 'administrator';
  }
};

export default {
  state,
  actions,
  mutations,
  getters
}
