<template>
  <v-app id="app">
    <login-dialog></login-dialog>
    <app-drawer></app-drawer>
    <app-header ref="header"></app-header>
    <main>
      <v-container fluid>
        <transition
          appear name="slide-y" mode="out-in"
          @before-leave="beforeLeave"
          @before-enter="beforeEnter"
        >
          <keep-alive include="register">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </v-container>
    </main>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script lang="ts">
  import bus from '@/event-bus';

  export default {
    data() {
      return {
        resetScroll: () => this.scrollTo(this.positions[this.prevFullPath])
      }
    },
    computed: {
      positions() {
        return this.$store.state.appshell.savedPosition;
      },
      prevFullPath() {
        return this.$store.state.appshell.previousFullPath;
      }
    },
    methods: {
      beforeLeave() {
        window.addEventListener('scroll', this.resetScroll);
      },
      beforeEnter() {
        this.$nextTick(() => {
          window.removeEventListener('scroll', this.resetScroll);
          this.scrollTo(this.positions[this.$route.fullPath], this.$route.meta.hashOffset);
          this.$store.commit('clearSavedPosition');
        })
      },
      scrollTo(pos, hashOffset) {
        if (!pos)
          return;
        if (pos.selector) {
          const el = document.querySelector(pos.selector);
          if (el) {
            let offset = pos.offset ? pos.offset : {};
            const docEl = document.documentElement;
            const docRect = docEl.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            window.scrollTo(
              elRect.left - docRect.left - (offset.x || 0),
              elRect.top - docRect.top - (offset.y || 0)
            );
            return;
          }
        }
        window.scrollTo(pos.x || 0, pos.y || 0);
      }
    }
  };
</script>

<style lang="stylus">
  @import './assets/global'

  html
    overflow-y auto!important

  input:-webkit-autofill
    -webkit-box-shadow 0 0 0 30px white inset;

  .slide-y
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
      transform translateY(40px)
</style>
