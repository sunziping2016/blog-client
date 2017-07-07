<template>
  <page-content>
    <md-table-card class="user-management">
      <md-toolbar>
        <h1 class="md-title">用户</h1>
        <div class="md-button-toggle md-theme-default">
          <md-button
            :class="{'md-icon-button': true, 'md-toggle': !!user_sort.name}"
            @click="user_sort = user_sort.name ? {} : {name:'user', type:'asc'}">
            <md-icon>sort</md-icon>
          </md-button>
        </div>
        <md-button class="md-icon-button" @click="$refs.useradd_dialog.open()">
          <md-icon>add</md-icon>
        </md-button>
      </md-toolbar>

      <md-table-alternate-header md-selected-label="选中">
        <md-button class="md-icon-button" @click="delete_selected()">
          <md-icon>delete</md-icon>
        </md-button>
      </md-table-alternate-header>

      <md-table :md-sort="user_sort.name" :md-sort-type="user_sort.type" @select="user_selected=arguments[0]" @sort="user_sort=arguments[0]">
        <md-table-header>
          <md-table-row>
            <md-table-head>头像</md-table-head>
            <md-table-head md-sort-by="user">用户名</md-table-head>
            <md-table-head md-sort-by="role">权限</md-table-head>
          </md-table-row>
        </md-table-header>

        <md-table-body>
          <md-table-row v-for="(user, row) in users" :key="row" :md-item="user" md-selection ref="users">
            <md-table-cell key="avatar" width="100px">
              <span v-if="!user.avatar"></span>
              <md-avatar v-else class="md-avatar-icon">
                <img :src="user.avatar" alt="avatar">
              </md-avatar>
            </md-table-cell>
            <md-table-cell key="username">
              <span>{{ user.user }}</span>
              <md-button class="md-icon-button" @click="remove_user(user.id)">
                <md-icon>delete</md-icon>
              </md-button>
            </md-table-cell>
            <md-table-cell key="role" width="100px">
              <md-select :value="user.role" @input="change_role(arguments[0], user, row)">
                <md-subheader>权限</md-subheader>
                <md-option value="administrator">管理员</md-option>
                <md-option value="editor">编辑</md-option>
              </md-select>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
    </md-table-card>
    <useradd-dialog ref="useradd_dialog" @close="arguments[0] && update_all_user()"></useradd-dialog>
    <md-dialog-confirm
      md-title="删除用户"
      md-content-html="确认要删除自己么？"
      md-ok-text="确认"
      md-cancel-text="取消"
      ref="confirm_dialog">
    </md-dialog-confirm>
  </page-content>
</template>

<script lang="ts">
  import _ from 'lodash';

  export default {
    data: () => ({
      user_selected: [],
      user_sort: {}
    }),
    computed: {
      users() {
        const users = this.$store.state.user.users;
        let list_users = Object.keys(users).map(id => _.extend({}, users[id], {id}));
        if (this.user_sort.name) {
          list_users = _.sortBy(list_users, [this.user_sort.name]);
          if (this.user_sort.type !== 'asc')
            list_users.reverse();
        }
        return list_users;
      }
    },
    methods: {
      async wait_for_confirm() {
        this.$refs.confirm_dialog.open();
        let _resolve, promise = new Promise((resolve, reject) => {
          _resolve = resolve;
        });
        this.$refs.confirm_dialog.$once('close', data => _resolve(data));
        return promise;
      },
      remove_user(uid) {
        (async ()=>{
          let go_on = true;
          if (uid === this.$store.state.session.uid)
            go_on = (await this.wait_for_confirm()) === 'ok';
          if (go_on) {
            await this.$store.dispatch('remove_user', uid);
            if (uid === this.$store.state.session.uid)
              await this.$store.dispatch('check_session');
            else
              await this.$store.dispatch('update_all_user');
          }
        })()
          .catch(err => {
            this.$root.$children[0].message(err.message);
          });
      },
      update_all_user() {
        this.$store.dispatch('update_all_user')
          .catch(err => {
            this.$root.$children[0].message(err.message);
          });
      },
      delete_selected() {
        (async ()=>{
          let ids = this.user_selected.map(user => user.id),
            self = this.$store.state.session.uid,
            contains = ids.indexOf(self) !== -1, go_on = true;
          if (contains)
            go_on = (await this.wait_for_confirm()) === 'ok';
          if (go_on) {
            await Promise.all(ids.map(user => user !== self && this.$store.dispatch('remove_user', user)));
            if (contains) {
              await this.$store.dispatch('remove_user', self);
              await this.$store.dispatch('check_session');
            } else
              await this.$store.dispatch('update_all_user');
          }
        })()
          .catch(err => {
              this.$root.$children[0].message(err.message);
            });
      },
      change_role(new_role, user, row) {
        if (user.role !== new_role) {
          const select = this.$refs.users[row].$children[3].$children[0];
          select.setTextAndValue(user.role);
          this.$store.dispatch('set_role', {id: user.id, role: new_role})
            .then(() => this.$store.dispatch('update_user', user.id))
            .catch(err => {
              this.$root.$children[0].message(err.message);
            });
        }
      }
    },
    mounted() {
      this.update_all_user();
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
