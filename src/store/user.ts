import Vue from 'vue';
import _ from 'lodash';

const state = {
  users: {}
};

const mutations = {
  update_user(state, {uid, user}) {
      Vue.set(state.users, uid, user);
  },
  update_all_user(state, users) {
    state.users = users;
  }
};

const actions = {
  async update_user({commit, dispatch}, uid) {
    let user = await dispatch('ajax', {action: 'user-info', data: {id: uid}});
    commit('update_user', {uid, user});
  },
  async update_all_user({commit, dispatch}) {
    let user_list = await dispatch('ajax', {action: 'user-list'}), users = {};
    for (let uid of user_list)
      users[uid] = await dispatch('ajax', {action: 'user-info', data: {id: uid}});
    commit('update_all_user', users);
  },
  async refresh_avatar({state, commit}, uid) {
    let user = state.users[uid], avatar = user.avatar;
    if (avatar !== undefined) {
      let index = avatar.lastIndexOf('?');
      if (index === -1)
        index = avatar.length;
      avatar = avatar.slice(0, index) + '?' + Date.now();
      user = _.extend({}, user, {avatar});
      commit('update_user', {uid, user});
    }
  },
  async add_user({dispatch}, user) {
    return await dispatch('ajax', {action: 'user-add', data: user});
  },
  async remove_user({dispatch}, uid) {
    return await dispatch('ajax', {action: 'user-remove', data: uid});
  },
  async set_role({dispatch}, data) {
    return await dispatch('ajax', {action: 'user-set-role', data});
  }
};

export default {
  state,
  mutations,
  actions
}
