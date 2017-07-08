<template>
  <md-dialog ref="dialog" @close="$emit('close', added);">
    <md-dialog-title>添加用户</md-dialog-title>
    <md-dialog-content>
      <form @keyup.enter="register()">
        <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->
        <input style="display:none" type="text" name="fakeusernameremembered">
        <input style="display:none" type="password" name="fakepasswordremembered">
        <md-input-container :class="{'md-input-invalid':username_error !== null}">
          <md-icon>account_circle</md-icon>
          <label>用户名</label>
          <md-input required type="text" :value="username" @input="username_error=null;username=arguments[0]"></md-input>
          <span class="md-error">{{ username_error }}</span>
        </md-input-container>
        <md-input-container md-has-password>
          <md-icon>vpn_key</md-icon>
          <label>密码</label>
          <md-input required type="password" v-model="password"></md-input>
        </md-input-container>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="close()">取消</md-button>
      <md-button class="md-primary" @click="register()" :disabled="!valid">添加</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
  export default {
    data: () => ({
      username: '',
      password: '',
      username_error: null,
      added:false
    }),
    computed: {
      valid() {
        let v = this.username !== '' && this.password !== '';
        return v && this.username_error === null;
      }
    },
    methods: {
      open() {
        this.$refs.dialog.open();
      },
      close() {
        this.$refs.dialog.close();
      },
      check_empty() {
        let error = false;
        if (this.username.length === 0) {
          this.username_error = '用户名不能为空';
          error = true;
        }
        if (this.password.length === 0) {
          this.password_error = '密码不能为空';
          error = true;
        }
        return error;
      },
      register() {
        if (this.check_empty())
          return;
        this.$store.dispatch('add_user', {username: this.username, password: this.password})
          .then(() => {
            this.username = '';
            this.password = '';
            this.added = true;
            this.$nextTick(() => this.close());
          })
          .catch(err => {
            switch (err.message) {
              case 'User already exists':
                this.username_error = '用户同名'; break;
              default:
                this.$root.$refs.app.message(err.message);
            }
          });
      }
    }
  };
</script>

<style scoped>
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }
</style>
