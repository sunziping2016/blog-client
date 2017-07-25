<template>
  <v-layout row justify-space-around>
    <v-card class="settings-panel elevation-1">
      <v-card-title class="headline">账户</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>头像</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>昵称</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>邮箱</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    name: 'settings',
    data() {
      return {
      }
    },
  };
</script>


<style lang="stylus" scoped>
  .settings-panel
    max-width 600px
    flex-grow 1


</style>

<style lang="stylus">
  .settings-panel
    .input-group
      margin 2px 0
    .subheader
      height 34px
      line-height 34px
      font-size: 16px
</style>
