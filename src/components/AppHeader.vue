<template>
  <v-toolbar fixed dark class="primary">
    <v-toolbar-side-icon @click.native.stop="$store.commit('drawerSet', !$store.state.appshell.drawer)">
    </v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import {mapState} from 'vuex';
  import 'vue-awesome/icons/sign-in';

  export default {};
</script>

<style lang="stylus" scoped>

</style>
