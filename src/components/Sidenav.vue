<template>
  <md-sidenav class="main-sidebar md-left md-fixed" md-swipeable ref="sidebar">
    <md-toolbar class="md-large" md-theme="white">
      <div class="md-toolbar-container">
      </div>
    </md-toolbar>
    <div class="main-sidebar-links">
      <md-list>
        <md-list-item>
          <router-link exact to="/">首页</router-link>
        </md-list-item>
      </md-list>
      <md-list>
        <md-list-item>
          <router-link exact to="/files">文件</router-link>
        </md-list-item>
      </md-list>
      <md-list v-if="$store.getters.is_admin">
        <md-list-item>
          <router-link exact to="/admin">管理</router-link>
        </md-list-item>
      </md-list>
      <md-list v-if="$store.getters.logined">
        <md-list-item>
          <router-link exact to="/settings">设置</router-link>
        </md-list-item>
      </md-list>
    </div>
  </md-sidenav>
</template>

<script lang="ts">
  export default {
    methods: {
      toggle() {
        this.$refs.sidebar.toggle();
      },
      close() {
        this.$refs.sidebar.close();
      }
    }
  }
</script>

<style lang="scss">
  @import '../../node_modules/vue-material/src/core/stylesheets/variables.scss';
  $sizebar-size: 280px;
  .main-sidebar.md-sidenav {
    .md-sidenav-content {
      width: $sizebar-size;
      display: flex;
      flex-flow: column;
      overflow: hidden;
      @media (min-width: 1281px) {
        top: 0;
        pointer-events: auto;
        transform: translate3d(0, 0, 0) !important;
        box-shadow: $material-shadow-2dp;
      }
    }
    .md-backdrop {
      @media (min-width: 1281px) {
        opacity: 0;
        pointer-events: none;
      }
    }

    .md-toolbar {
      min-height: 172px;
      border-bottom: 1px solid rgba(#000, .12);
    }

    .main-sidebar-links {
      overflow: auto;
      flex: 1;
      .md-inset .md-list-item-container {
        padding-left: 36px;
      }
      .md-list-item-container {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
</style>
