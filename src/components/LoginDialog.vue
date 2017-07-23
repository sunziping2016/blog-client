<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">登录</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="邮箱"
            type="email"
            v-model="email"
            @keyup.native.enter="onSubmit"
            :error-messages="emailError ? [emailError] : []"
          ></v-text-field>
          <v-text-field
            label="密码"
            type="password"
            v-model="password"
            @keyup.native.enter="onSubmit"
            :error-messages="passwordError ? [passwordError] : []"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="dialog = false">取消</v-btn>
          <v-btn flat
                 :disable="loginValid"
                 @click.native="onSubmit">
            登录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
  import { mapMutations, mapActions } from 'vuex';
  import debounce from 'lodash/debounce.js';

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default {
    data() {
      return {
        email: undefined,
        password: undefined,
        emailError: null,
        passwordError: null
      }
    },
    computed: {
      loginValid() {
        return this.email && this.password &&
          !this.emailError && !this.passwordError;
      },
      dialog: {
        get(): boolean {
            return this.$store.state.appshell.loginDialog;
        },
        set(value: boolean): void {
          this.$store.commit('loginDialogSet', value);
        }
      }
    },
    watch: {
      email() {
        if (this.email === '')
          this.emailError = '邮箱必填';
        else if (!emailRegex.test(this.email))
          this.emailError = '非法的邮箱格式';
        else
          this.emailError = null;
      },
      password() {
        if (this.password.length < 8)
          this.passwordError = '密码长度至少为8';
        else
          this.passwordError = null;
      }
    },
    methods: {
      onSubmit: debounce(function () {
        if (!this.loginValid)
          return;
        this.clearAuthenticateError();
        this.authenticate({strategy: 'local', email: this.email, password: this.password})
          .then(() => this.snackbarAddMessage('成功登录！'))
          .catch(error => {
            switch (error.message) {
              case 'Invalid login':
                this.passwordError = '用户名或密码错误';
                break;
              default:
                this.snackbarAddMessage(error.message);
            }
          })
          .then(() => this.dialog = false);
      }, 300, {leading: true}),
      ...mapMutations('auth', {clearAuthenticateError: 'clearAuthenticateError'}),
      ...mapActions('auth', ['authenticate']),
      ...mapMutations(['snackbarAddMessage'])
    }
  }
</script>

