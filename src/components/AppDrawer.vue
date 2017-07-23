<template>
  <v-navigation-drawer persistent light enable-resize-watcher
                       :mini-variant.sync="mini" v-model="drawer" overflow>
    <v-list three-line>
      <v-list-tile avatar tag="div" :class="{'has-not-user': !user}">
        <v-list-tile-avatar v-if="user">
          <img v-if="user.avatar" :src="user.avatar">
          <icon v-else name="user-circle-o" scale="2"></icon>
        </v-list-tile-avatar>
        <v-list-tile-content v-if="user">
          <v-list-tile-title :title="user.email">{{user.nickname || user.email}}</v-list-tile-title>
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
      <component v-for="item, row in items"
                 :key="item.action || `action-${row}`"
                 :is="item.type || 'v-list-tile'"
                 @click.native.stop='handleClick(item)'>
        <v-list-tile-action v-if="!item.type || item.type === 'v-list-tile'">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content v-if="!item.type || item.type === 'v-list-tile'">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </component>
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
      items() {
        return this.$store.state.appshell.drawerItems;
      },
      user () {
        return this.$store.state.auth.user;
      }
    },
    methods: {
      handleClick(item) {
        if (item.action)
          bus.$emit(`app-drawer:${item.action}`, item.action_data);
      }
    },
    mounted() {
      bus.$on(`app-drawer:go`, route => this.$router.push(route));
    }
  }
</script>

<style lang="stylus">
  .has-not-user > div
    justify-content flex-end

  .avatar .fa-icon
    color rgba(0,0,0,0.54)!important
</style>
