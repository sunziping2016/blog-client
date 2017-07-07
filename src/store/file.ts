import Vue from 'vue';
import 'whatwg-fetch';

const state = {
  'private': {content:{},dir:true,checked:false},
  share: {content:{},dir:true,checked:false},
};

const mutations = {
  add_dir(state, {mode, path, content, checked}) {
    path = path.split('/').filter(x => x.length);
    let current = state[mode];
    for (let dir of path) {
      if (current.content[dir] !== undefined)
        Vue.set(current.content, dir, {content:{},dir:true,checked:false});
      else if (!current.content[dir])
        throw new Error('Invalid path');
      current = current.content[dir];
    }
    current.checked = checked;
    current = current.content;
    for (let file in content) {
      if (!content.hasOwnProperty(file))
        continue;
      if (current[file] !== undefined) {
        if (content[file] && !current[file].dir)
          current[file] = {content:{},dir:true,checked:false};
        else if (!content[file] && current[file].dir)
          current[file] = {dir:false};
      } else {
        if (content[file])
          Vue.set(current, file, {content:{},dir:true,checked:false});
        else
          Vue.set(current, file, {dir:false});
      }
    }
  }
};

const actions = {
  async get_file({commit, dispatch, rootState}, {mode, dir}) {
    let url = rootState.api.site + '/file' + dir + '>';

  },

  async update_dir({commit, dispatch, rootState}, {mode, dir}) {
    let url = rootState.api.site + '/file' + dir + '>';

  }
};

export default {
  state,
  mutations,
  actions
}
