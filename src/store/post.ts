import Vue from 'vue';
import _ from 'lodash';

const state = {
  posts: {}
};

const mutations = {
  update_post(state, {id, post}) {
    Vue.set(state.posts, id, post);
  },
  update_all_posts(state, posts) {
    state.posts = posts;
  }
};

const actions = {
  async update_post({commit, dispatch}, id) {
    let post = await dispatch('ajax', {action: 'post-info', data: {id}});
    await dispatch('ajax', {action: 'user-info', data: {id:post.owner}});
    commit('update_post', {id, post});
  },
  async update_all_posts({commit, dispatch}) {
    let post_list = await dispatch('ajax', {action: 'post-list'}), posts = {};
    for (let id of post_list) {
      posts[id] = await dispatch('ajax', {action: 'post-info', data: {id}});
      await dispatch('ajax', {action: 'user-info', data: {id:posts[id].owner}});
    }
    commit('update_all_posts', posts);
  },
  async add_post({dispatch}, post) {
    return await dispatch('ajax', {action: 'post-publish', data: post});
  },
  async remove_post({dispatch}, id) {
    return await dispatch('ajax', {action: 'post-unpublish', data: id});
  },
  async post_modify({dispatch}, data) {
    return await dispatch('ajax', {action: 'post-update', data});
  }
};

export default {
  state,
  mutations,
  actions
}
