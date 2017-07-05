<template>
  <page-content>
    <md-table-card class="user-management">
      <md-toolbar>
        <h1 class="md-title">用户</h1>
      </md-toolbar>

      <md-table-alternate-header md-selected-label="选中">
        <md-button class="md-icon-button">
          <md-icon>delete</md-icon>
        </md-button>
      </md-table-alternate-header>

      <md-table md-sort="calories">
        <md-table-header>
          <md-table-row>
            <md-table-head>头像</md-table-head>
            <md-table-head md-sort-by="user">用户名</md-table-head>
            <md-table-head md-sort-by="role">权限</md-table-head>
          </md-table-row>
        </md-table-header>

        <md-table-body>
          <md-table-row v-for="(user, row) in users" :key="user.id" :md-item="user" md-selection>
            <md-table-cell key="avatar" width="100px">
              <span>{{ user.avatar }}</span>
            </md-table-cell>
            <md-table-cell key="username">
              <span>{{ user.user }}</span>
              <md-button class="md-icon-button">
                <md-icon>delete</md-icon>
              </md-button>
            </md-table-cell>
            <md-table-cell key="role" width="100px">
              <md-select :value="user.role">
                <md-subheader>权限</md-subheader>
                <md-option value="administrator">管理员</md-option>
                <md-option value="editor">编辑</md-option>
              </md-select>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
    </md-table-card>
  </page-content>
</template>

<script lang="ts">
  import _ from 'lodash';

  export default {
    computed: {
      users() {
        const users = this.$store.state.user.users;
        return Object.keys(users).map(id => _.extend({}, users[id], {id}));
      }
    },
    mounted() {
      this.$store.dispatch('update_all_user')
        .catch(err => {
          this.$root.$children[0].message(err.message);
        });
    }
  }
</script>

<style>
  .user-management tr button {
    opacity: 0;
  }
  .user-management tr:hover button {
    opacity: 1;
  }
</style>
