<template>
  <md-whiteframe md-tag="md-toolbar" md-elevation="1" class="main-header">
    <md-button class="md-icon-button nav-trigger" @click="$root.$children[0].toggleSidebar()">
      <md-icon>menu</md-icon>
    </md-button>

    <h2 class="md-title">{{ $store.state.route.meta.title || title }}</h2>

    <md-button v-if="!$store.getters.logined" class="md-icon-button" @click="$root.$children[0].openLoginDialog()">
      <md-icon>account_circle</md-icon>
    </md-button>
    <md-button v-else class="md-icon-button" @click="logout()">
      <md-icon>exit_to_app</md-icon>
    </md-button>
  </md-whiteframe>
</template>

<script lang="ts">
export default {
  props: {
    title: String,
    pageTitle: String
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$root.$children[0].message('成功登出！');
        })
        .catch(err => {
          this.$root.$children[0].message(err.message);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
  .main-header {
    z-index: 2;
    color: #fff !important;
  }
  .nav-trigger {
    @media (min-width: 1281px) {
      display: none;
    }
  }
  .md-title {
    flex: 1;
    @media (min-width: 1281px) {
      margin-left: 8px;
    }
  }
</style>
