<template>
  <v-container fluid>
    <v-layout row justify-space-around>
      <markdown-viewer :content="content"></markdown-viewer>
    </v-layout>
  </v-container>
</template>

<script>
  import body from './hello.txt';

  export default {
    data() {
      return {
        content: body
      };
    }
  };
</script>

<style lang="stylus">
  .markdown-body
    max-width 920px
</style>
