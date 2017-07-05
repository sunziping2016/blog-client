<template>
  <div id="app" class="main-app">
    <main-sidebar ref="sidebar"></main-sidebar>
    <div class="container">
      <main-header :title="title" @toggle="toggleSidebar"></main-header>
      <transition name="router" appear mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <login-dialog ref="login_dialog"></login-dialog>
    <md-snackbar ref="snackbar" @open="snackbar_closed=false" @close="snackbar_closed=true">
      <span>{{ snackbar_message[0] }}</span>
    </md-snackbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'app',
  props: {
    title:String
  },
  data: ()=>({
    snackbar_message: [],
    snackbar_closed: true
  }),
  methods: {
    toggleSidebar() {
      this.$refs.sidebar.toggle();
    },
    closeSidebar() {
      this.$refs.sidebar.close();
    },
    openLoginDialog() {
      this.$refs.login_dialog.open();
    },
    message(msg) {
      this.snackbar_message.push(msg);
      if (this.snackbar_closed)
        this.$refs.snackbar.open();
      else
        this.$refs.snackbar.close();
    }
  },
  mounted() {
    let handler = e => {
      if (this.snackbar_closed === false)
        return;
      this.snackbar_message.splice(0,1);
      if (this.snackbar_message.length)
        this.$refs.snackbar.open();
    };
    this.$refs.snackbar.$el.addEventListener('transitionend', handler);
  }
};
</script>

<style lang="scss">
  @import '../node_modules/vue-material/src/core/stylesheets/variables.scss';
  $sizebar-size: 280px;
  html, body {
    height: 100%;
    overflow: hidden;
  }
  .main-app {
    height: 100%;
  }
  .container {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    transition: $swift-ease-out;
    @media (min-width: 1281px) {
      padding-left: $sizebar-size;
    }
  }

  .router-enter-active {
    transition: $swift-ease-out;
  }
  .router-leave-active {
    transition: $swift-ease-in;
  }
  .router-enter, .router-leave-to {
    opacity: 0;
    transform: translate3D(0, 60px, 0);
  }
</style>
