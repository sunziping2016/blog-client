<template>
  <v-app id="app">
    <app-drawer></app-drawer>
    <app-header></app-header>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script lang="ts">
  import bus from '@/event-bus';
  export default {
  };
</script>

<style lang="stylus">
  @import './assets/styles/global'

  html
    overflow-y hidden!important
</style>

<style lang="stylus" scoped>
</style>
