interface Message {
  content: string;
  action?: string;
  action_text?: string;
  action_class?: any;
  action_data?: any;
  timeout?: number;
}

interface DrawerItem {
  title: string;
  action?: string;
  type?: string;
  icon?: string;
  action_data?: any;
}

class State {
  newVersionAvailable = false;

  savedPosition: {[path:string]: { x: number, y: number } | { selector: string }} = {};
  previousFullPath: string = '';

  snackbar: boolean = false;
  snackbarMessages: Array<Message> = [];

  drawer: boolean = false;
  drawerMini: boolean = false;

  loginDialog: boolean = false;
}

const state = new State();

const mutations = {
  newVersionAvailable(state: State) {
    state.newVersionAvailable = true;
  },
  addSavedPosition(state: State, {path, position}:
    {path: string, position: { x: number, y: number } | { selector: string }}): void {
    state.savedPosition[path] = position;
  },
  clearSavedPosition(state: State): void {
    state.savedPosition = {};
  },
  setPreviousFullPath(state: State, path:string): void {
    state.previousFullPath = path;
  },
  snackbarAddMessage(state: State, message: string | Message): void {
    if (typeof message !== 'object')
      message = { content: message };
    state.snackbarMessages.push(message);
    state.snackbar = !state.snackbar;
  },
  snackbarNextMessage(state: State): void {
    state.snackbarMessages.splice(0, 1);
    if (state.snackbarMessages.length)
      state.snackbar = true;
  },
  snackbarSet(state: State, value: boolean): void {
    state.snackbar = value;
  },
  drawerSet(state: State, value: boolean): void {
    state.drawer = value;
  },
  drawerSetMini(state: State, mini: boolean): void {
    state.drawerMini = mini;
  },
  loginDialogSet(state: State, visible: boolean): void {
    state.loginDialog = visible;
  }
};

export default {
  state,
  mutations
};
