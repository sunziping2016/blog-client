<template>
  <md-dialog ref="dialog">
    <md-tabs md-fixed md-elevation="1" @change="active=arguments[0];clearError()" ref="tabs">
      <md-tab md-label="登入" id="login" class="no-padding">
        <form @keyup.enter="login()">
          <md-input-container :class="{'md-input-invalid':username_error !== null}">
            <md-icon>account_circle</md-icon>
            <label>用户名</label>
            <md-input required type="text" :value="username" @input="username_error=null;username=arguments[0]"></md-input>
            <span class="md-error">{{ username_error }}</span>
          </md-input-container>
          <md-input-container :class="{'md-input-invalid':password_error !== null}" md-has-password>
            <md-icon>vpn_key</md-icon>
            <label>密码</label>
            <md-input required type="password" :value="password" @input="password_error=null;password=arguments[0]"></md-input>
            <span class="md-error">{{ password_error }}</span>
          </md-input-container>
        </form>
        <md-dialog-actions>
          <md-button class="md-primary" @click="close()">取消</md-button>
          <md-button class="md-primary" @click="login()" :disabled="!valid">登录</md-button>
        </md-dialog-actions>
      </md-tab>

      <md-tab md-label="注册" id="register" class="no-padding">
        <form @keyup.enter="register()">
          <md-input-container :class="{'md-input-invalid':username_error !== null}">
            <md-icon>account_circle</md-icon>
            <label>用户名</label>
            <md-input required type="text" :value="username" @input="username_error=null;username=arguments[0]"></md-input>
            <span class="md-error">{{ username_error }}</span>
          </md-input-container>
          <md-input-container :class="{'md-input-invalid':password_error !== null}" md-has-password>
            <md-icon>vpn_key</md-icon>
            <label>密码</label>
            <md-input required type="password" :value="password" @input="password_error=null;password=arguments[0]"></md-input>
            <span class="md-error">{{ password_error }}</span>
          </md-input-container>
        </form>
        <md-dialog-actions>
          <md-button class="md-primary" @click="close()">取消</md-button>
          <md-button class="md-primary" @click="register()" :disabled="!valid">注册</md-button>
        </md-dialog-actions>
      </md-tab>
    </md-tabs>
  </md-dialog>
</template>

<script lang="ts">
export default {
  data: () => ({
    username: '',
    password: '',
    username_error: null,
    password_error: null,
    active: 0
  }),
  computed: {
    valid() {
      let v = this.username !== '' && this.password !== '';
      return v && this.username_error === null && this.password_error === null;
    }
  },
  methods: {
    open() {
      this.$refs.dialog.open();
      this.$refs.tabs.calculateOnResize();
      this.password_confirm = '';
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
    login() {
      if (this.check_empty())
          return;
      this.$store.dispatch('login', {username: this.username, password: this.password})
        .then(() => {
          this.close();
          this.$root.$children[0].message('成功登入！');
        })
        .catch(err => {
          switch (err.message) {
            case 'User does not exist':
              this.username_error = '用户不存在'; break;
            case 'Wrong password':
              this.password_error = '密码错误'; break;
            default:
              this.$root.$children[0].message(err.message);
          }
        });
    },
    clearError() {
      this.username_error = null;
      this.password_error = null;
    },
    register() {
      if (this.check_empty())
        return;
      this.$store.dispatch('register', {username: this.username, password: this.password})
        .then(() => {
          this.close();
          this.$root.$children[0].message('成功注册并登入！');
        })
        .catch(err => {
          switch (err.message) {
            case 'User already exists':
              this.username_error = '用户已被注册'; break;
            default:
              this.$root.$children[0].message(err.message);
          }
        });
    }
  }
}
</script>

<style scoped>
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }
  .no-padding {
    padding: 0 0 12px;
  }
  form {
    padding: 24px 24px 0;
  }
</style>
