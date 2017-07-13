<template>
  <div ref="app">
    <app-header></app-header>
    <div class="app-shell app-shell-bottom-navigation">
      <div class="app-view-wrapper">
        <transition>
          <keep-alive>
            <router-view
              :key="$route.fullPath"
              v-if="!$route.meta.notKeepAlive"
              class="app-view">
            </router-view>
          </keep-alive>
        </transition>
        <transition>
          <router-view
            :key="$route.fullPath"
            v-if="$route.meta.notKeepAlive"
            class="app-view">
          </router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
