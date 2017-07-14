class State {
  drawer: boolean = false;
}

const state = new State();

const mutations = {
  drawerSet(state: State, value: boolean): void {
    state.drawer = value;
  },
  drawerToggle(state: State): void {
    state.drawer = !state.drawer;
  }
};

export default {
  state,
  mutations
};
