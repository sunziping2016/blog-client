<template>
  <v-navigation-drawer persistent light enable-resize-watcher
                       :mini-variant.sync="mini" v-model="drawer" overflow>
    <v-list three-line>
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
          <img src="https://randomuser.me/api/portraits/men/85.jpg" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>John Leider</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click.native.stop="mini = !mini">
            <v-icon>chevron_left</v-icon>
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
  import bus from '@/event-bus.js';

  export default {
    computed: {
      drawer: {
        get(): boolean {
          return this.$store.state.drawer.drawer;
        },
        set(value: boolean): void {
          if (value !== this.drawer)
            this.$store.commit('drawerSet', value);
        }
      },
      mini: {
        get(): boolean {
          return this.$store.state.drawer.mini;
        },
        set(value: boolean): void {
          if (value !== this.mini)
            this.$store.commit('drawerSetMini', value);
        }
      },
      items() {
        return this.$store.state.drawer.items;
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
