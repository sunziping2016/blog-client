interface Message {
  content: string;
  action?: string;
  action_text?: string;
  action_class?: any;
  timeout?: number;
}

class State {
  snackbar: boolean = false;
  snackbar_messages: Array<Message> = [];

  new_version_available = false;
}

const state = new State();

const mutations = {
  snackbarAddMessage(state: State, new_message: string | Message): void {
    if (typeof new_message !== 'object')
      new_message = { content: new_message };
    state.snackbar_messages.push(new_message);
    state.snackbar = !state.snackbar;
  },
  snackbarNextMessage(state: State): void {
    state.snackbar_messages.splice(0, 1);
    if (state.snackbar_messages.length)
      state.snackbar = true;
  },
  snackbarSet(state: State, value: boolean): void {
    state.snackbar = value;
  },

  newVersionAvailable(state: State) {
    state.new_version_available = true;
  }
};

export default {
  state,
  mutations
};
