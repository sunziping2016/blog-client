<template>
  <v-toolbar fixed dark class="primary">
    <v-toolbar-side-icon @click.native.stop="$store.commit('drawerToggle')">
    </v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
  };
</script>

<style lang="stylus" scoped>

</style>
