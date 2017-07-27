<template>
  <v-navigation-drawer
    persistent light enable-resize-watcher
    :mini-variant.sync="mini" v-model="drawer" overflow>
    <v-list three-line>
      <v-list-tile avatar tag="div" @click.native.stop="onUserClick" class="clickable">
        <v-list-tile-avatar>
          <img v-if="user && user.avatar" :src="user.avatar">
          <icon v-else name="user-circle-o" scale="2"></icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{user ? user.nickname || user.email : '登录'}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click.native.stop="mini = !mini">
            <v-icon>{{ `chevron_${mini ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list>
      <v-divider></v-divider>
      <v-list-tile exact to="/" @click.native.stop>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>主页</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile exact to="/register" v-if="!user" @click.native.stop>
        <v-list-tile-action>
          <v-icon>account_circle</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>注册</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile exact to="/settings" v-else @click.native.stop>
        <v-list-tile-action>
          <v-icon>account_circle</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>设置</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile exact to="/markdown" @click.native.stop>
        <v-list-tile-action>
          <v-icon>book</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>测试</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import 'vue-awesome/icons/user-circle-o';
  import bus from '@/event-bus';

  export default {
    computed: {
      drawer: {
        get(): boolean {
          return this.$store.state.appshell.drawer;
        },
        set(value: boolean): void {
          if (value !== this.drawer)
            this.$store.commit('drawerSet', value);
        }
      },
      mini: {
        get(): boolean {
          return this.$store.state.appshell.drawerMini;
        },
        set(value: boolean): void {
          if (value !== this.mini)
            this.$store.commit('drawerSetMini', value);
        }
      },
      user() {
        return this.$store.state.auth.user;
      }
    },
    methods: {
      onUserClick() {
        if (this.user)
          this.$router.push('/settings');
        else {
          if (window.innerWidth <= 1024)
            this.drawer = false;
          this.$store.commit('loginDialogSet', true);
        }
      }
    },
    mounted() {
      this.drawer = window.innerWidth > 1024;
    }
  }
</script>

<style lang="stylus">
  .avatar .fa-icon
    color rgba(0,0,0,0.54)!important
  @media (max-width: 1424px) and (orientation: landscape)
    .navigation-drawer--mini-variant {
      margin-top: 64px!important;
      max-height: calc(100vh - 64px)!important;
    }
  .clickable
    cursor pointer
  .navigation-drawer
    z-index 5!important
</style>
