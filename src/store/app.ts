class State {
  new_version_available = false;
}

const state = new State();

const mutations = {
  newVersionAvailable(state: State) {
    state.new_version_available = true;
  }
};

export default {
  state,
  mutations
};
