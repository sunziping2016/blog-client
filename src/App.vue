<template>
  <v-app id="app">
    <login-dialog></login-dialog>
    <app-drawer></app-drawer>
    <app-header></app-header>
    <main>
      <transition name="slide-y" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script lang="ts">
  import bus from '@/event-bus';
  export default {};
</script>

<style lang="stylus">
  @import './assets/styles/global'

  html
    overflow-y hidden!important

  input:-webkit-autofill
    -webkit-box-shadow 0 0 0 30px white inset;

  .slide-y
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
      transform translateY(40px)
</style>
