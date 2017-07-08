import Vue from 'vue';
import 'whatwg-fetch';

const state = {
  'private': {content:{},dir:true,checked:false},
  share: {content:{},dir:true,checked:false},
};

const mutations = {
  add_dir(state, {mode, path, content, checked}) {
    let current = state[mode];
    for (let dir of path) {
      if (!current.dir)
        current = {content:{},dir:true,checked:false};
      if (current.content[dir] === undefined)
        Vue.set(current.content, dir, {content:{},dir:true,checked:false});
      current = current.content[dir];
    }
    if (checked)
      current.checked = checked;
    current = current.content;
    Object.keys(current).forEach(x => {
      if (content[x] === undefined)
        Vue.delete(current, x);
    });
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
  async get_file({rootState}, {mode, path, name, type, isjson}) {
    if (rootState.api.site === null)
      throw new Error('Cannot get access to server.');
    let url = `${rootState.api.site}/${['file'].concat(path).join('/')}`,
      param = {mode, name, type}, response,
      qs = Object.keys(param).map(x => x + '=' + param[x]).join('&');
    if (path.length == 0)
      url += '/';
    if (qs !== '')
      url += '?' + qs;
    if (type !== undefined)
      url += '&type=' + type;
    response = await fetch(url, {credentials: 'include'});
    if (isjson) {
      let json = await response.json();
      if (json.status !== 0)
        throw new Error(json.data);
      return json.data === undefined ? null : json.data;
    }
    return response;
  },
  async update_dir({commit, dispatch}, {mode, path}) {
    let content = await dispatch('get_file', {mode, path, isjson:true, type:'dir'});
    commit('add_dir', {mode, path, content, checked: true});
  },
  async create_dir({rootState}, {mode, path}) {
    if (rootState.api.site === null)
      throw new Error('Cannot get access to server.');
    let url = `${rootState.api.site}/${['file'].concat(path).join('/')}`,
      param = {mode, name, type: 'dir'}, response, data = new FormData();
    Object.keys(param).forEach(x => data.append(x, param[x]));
    response = await fetch(url, {method: 'POST', credentials: 'include', body:data});
    let json = await response.json();
    if (json.status !== 0)
      throw new Error(json.data);
    return json.data === undefined ? null : json.data;
  },
  async delete_file({rootState}, {mode, path}) {
    if (rootState.api.site === null)
      throw new Error('Cannot get access to server.');
    let url = `${rootState.api.site}/${['file'].concat(path).join('/')}`,
      param = {mode, name}, response, data = new FormData();
    Object.keys(param).forEach(x => data.append(x, param[x]));
    response = await fetch(url, {method: 'DELETE', credentials: 'include', body:data});
    let json = await response.json();
    if (json.status !== 0)
      throw new Error(json.data);
    return json.data === undefined ? null : json.data;
  },};

export default {
  state,
  mutations,
  actions
}
