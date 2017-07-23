<template>
  <v-toolbar fixed dark class="primary">
    <v-toolbar-side-icon @click.native.stop="$store.commit('drawerToggle')">
    </v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
    <v-btn icon @click.native.stop="$store.commit('loginDialogSet', true)">
      <icon name="sign-in" scale="1.5"></icon>
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
