import 'whatwg-fetch';

const method_mapping = {
  'ajax-get': 'GET',
  'ajax-post': 'POST',
  'ajax-put': 'PUT',
  'ajax-delete': 'DELETE',
  'ajax-patch': 'PATCH'
};

const state = {
  site: null,
  api_list: {},
  ws_connected: false,
};

const actions = {
  async change_site({commit, state}, new_site: string) {
    if (new_site[new_site.length - 1] === '/')
      new_site = new_site.slice(0, new_site.length - 1);
    if (new_site === state.site)
      return;
    let response = await fetch(new_site + '/api/api-list', {credentials: 'include'}), json = await response.json();
    if (json.status !== 0)
      throw new Error(json.data);
    commit('update_site', new_site);
    commit('update_api', json.data);
  },
  async ajax({state}, {action, data, form, method}: { action: string, data?: any, form?: boolean, method?: string }) {
    if (state.site === null)
      throw new Error('Cannot get access to server.');
    let valid_protocol = state.api_list[action];
    if (valid_protocol === undefined)
      throw new Error('Invalid action');
    let url = state.site + '/api/' + action, response = null;

    if (method === undefined)
      for (let protocol of valid_protocol)
        if ((method = method_mapping[protocol]) !== undefined)
          break;
    if (method === undefined)
      throw new Error('Invalid protocol');

    if (method === 'GET') {
      if (data)
        url += '?' + Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent((data[k]))).join('&');
      response = await fetch(url, {credentials: 'include'});
    } else {
      if (form) {
        let body = new FormData();
        Object.keys(data).forEach(k => body.append(k, body[k]));
        response = await fetch(url, {
          method,
          body,
          credentials: 'include'
        })
      } else {
        response = await fetch(url, {
          method,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
          credentials: 'include'
        });
      }
    }
    let json = await response.json();
    if (json.status !== 0)
      throw new Error(json.data);
    return json.data === undefined ? null : json.data;
  }
};

const mutations = {
  update_api(state, api_list: { [id: string]: Array<string> }) {
    state.api_list = api_list;
  },
  update_site(state, site: string) {
    state.site = site;
  }
};

export default {
  state,
  actions,
  mutations
}
