import Vue from 'vue';

const state = {
  users: {}
};

const mutations = {
  update_user(state, user) {
      Vue.set(state.users, user.id, {
        user: user.user,
        role: user.role,
        avatar: user.avatar
      });
  }
};

const actions = {
  async update_user({commit, dispatch}, uid) {
    let info = await dispatch('ajax', {action: 'user-info', data: {id: uid}});
    info.id = uid;
    commit('update_user', info);
  },
  async update_all_user({dispatch}) {
    let user_list = await dispatch('ajax', {action: 'user-list'});
    for (let id of user_list)
      await dispatch('update_user', id);
  },
  async add_user({dispatch}, user) {
    return await dispatch('ajax', {action: 'user-add', data: user});
  }
};

export default {
  state,
  mutations,
  actions
}
