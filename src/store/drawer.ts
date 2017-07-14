interface Item {
  title: string;
  action?: string;
  type?: string;
  icon?: string;
  action_data?: any;
}

class State {
  drawer: boolean = false;
  mini: boolean = false;
  items: Array<Item> = [
    { title: 'Home', icon: 'dashboard', action: 'go', action_data: '/'},
    { title: 'About', icon: 'question_answer', action: 'go', action_data: '/register'}
  ];
}

const state = new State();

const mutations = {
  drawerSet(state: State, value: boolean): void {
    state.drawer = value;
  },
  drawerToggle(state: State): void {
    state.drawer = !state.drawer;
  },
  drawerSetItems(state: State, items: Array<Item>): void {
    state.items = items;
  },
  drawerSetMini(state: State, mini: boolean): void {
    state.mini = mini;
  }
};

export default {
  state,
  mutations
};
