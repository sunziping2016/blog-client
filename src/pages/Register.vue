<template>
  <v-layout row justify-space-around>
    <v-stepper :value="step" vertical class="register-panel">
      <v-stepper-step :step="1" :complete="step > 1">注册</v-stepper-step>
      <v-stepper-content :step="1">
        <!-- Fake elements -->
        <input class="fake-input" type="email">
        <input class="fake-input" type="password">
        <v-text-field
          label="邮箱"
          type="email"
          v-model="email"
          @keyup.native.enter="onRegister"
          :error-messages="emailError ? [emailError] : []"
        ></v-text-field>
        <v-text-field
          label="密码"
          v-model="password"
          @keyup.native.enter="onRegister"
          :error-messages="passwordError ? [passwordError] : []"
          :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
          :append-icon-cb="() => (passwordVisible = !passwordVisible)"
          :type="passwordVisible ? 'text' : 'password'"
        ></v-text-field>
        <v-btn @click.native="$router.back()">取消</v-btn>
        <v-btn primary
               :disabled="!registerValid"
               @click.native="onRegister">
          注册
        </v-btn>
      </v-stepper-content>
      <v-stepper-step :step="2" :complete="step > 2">验证邮箱</v-stepper-step>
      <v-stepper-content :step="2">
        <p v-if="sending">我们正在向您的邮箱发送验证邮件。</p>
        <p v-else-if="!!sendTime">我们已经向您的邮箱发送了验证邮件。</p>
        <p v-else>点击“发送”按钮发送验证邮件。</p>
        <v-btn @click.native="cancel">取消</v-btn>
        <v-btn
          primary
          :loading="!!(sending || resendRemainingTime)"
          :disabled="!!(sending || resendRemainingTime)"
          class="resend-btn"
          @click.native="onSend">
          {{sendTime ? '重新发送' : '发送'}}
          <span slot="loader">{{sending ? '发送中...' : `${Math.round(resendRemainingTime / 1000)}秒后重发`}}</span>
        </v-btn>
      </v-stepper-content>
      <v-stepper-step :step="3">完成</v-stepper-step>
      <v-stepper-content :step="3">
        <p>您已完成注册！登录后会跳回主页。</p>
        <v-btn primary @click.native="login">登录</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-layout>
</template>

<script lang="ts">
  import { mapMutations, mapActions, mapState } from 'vuex';
  import { paramsForServer } from 'feathers-hooks-common';
  import debounce from 'lodash/debounce.js';
  import client from '@/feathers';

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const mailsendTime = 60000;

  export default {
    name: 'register',
    data() {
      return {
        step: 1,
        email: '',
        password: '',
        passwordVisible: false,
        emailError: null,
        passwordError: null,
        id: null,
        sendTime: null,
        subscription: null,
        sending: false,
        resendRemainingTime: 0,
        resendRemainingTimer: null,
      }
    },
    computed: {
      registerValid() {
        return this.email && this.password &&
          !this.emailError && !this.passwordError;
      },
      user() {
        return this.id && this.$store.getters["users/get"](this.id);
      },
      authUser() {
        return this.$store.state.auth.user;
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
      },
      sendTime() {
        if (this.resendRemainingTimer) {
          clearInterval(this.resendRemainingTimer);
          this.resendRemainingTimer = null;
        } if (this.sendTime) {
          this.refreshRemainingTime();
          this.resendRemainingTimer = setInterval(() => this.refreshRemainingTime(), 1000);
        } else
          this.resendRemainingTime = 0;
      },
      user() {
        if (this.user && this.user.verified && this.step !== 3) {
          this.step = 3;
        }
      },
    },
    methods: {
      cancel() {
        if (this.id)
          this.$store.dispatch('users/remove', this.id)
            .catch(err => this.snackbarAddMessage(err.message));
        this.id = null;
        this.sendTime = null;
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
        };
        this.step = 1;
      },
      refreshRemainingTime() {
        let now = Date.now();
        if (now - this.sendTime < mailsendTime) {
          this.resendRemainingTime = mailsendTime - (now - this.sendTime);
        } else {
          clearInterval(this.resendRemainingTimer);
          this.resendRemainingTimer = null;
          this.resendRemainingTime = 0;
        }
      },
      onRegister: debounce(function () {
        if (!this.registerValid)
          return;
        if (this.subscription)
          this.subscription.unsubscribe();
        this.subscription = (<any>client).service('users').create({
            email: this.email,
            password: this.password
        }).subscribe(user => {
          if (!user || !user._id)
            return;
          this.$store.dispatch('users/addOrUpdate', user);
          if (this.id !== user._id) {
            this.id = user._id;
            this.step = 2;
            this.onSend();
          }
        }, error => {
          let errorResolved = false;
          if (error.errors && !Array.isArray(error.errors)) {
            for (let name in error.errors) {
              if (error.errors.hasOwnProperty(name) && name === 'email'
                && error.errors[name] === 'Email already taken') {
                this.emailError = '邮箱已被注册';
                errorResolved = true;
              }
            }
          }
          if (!errorResolved)
            this.snackbarAddMessage(error.message);
        });
      }, 300, {leading: true}),
      onSend: debounce(function () {
        this.clearPatchError();
        this.sending = true;
        this.$store.dispatch('users/patch', [this.id, {}, paramsForServer({validation: 1})])
          .then(user => {
            this.$store.dispatch('users/addOrUpdate', user);
            this.sendTime = Date.now();
          })
          .catch(err => this.snackbarAddMessage(err.message))
          .then(() => this.sending = false);
      }, 300, {leading: true}),
      login() {
        this.subscription.unsubscribe();
        this.subscription = null;
        this.authenticate({
          strategy: 'local',
          email: this.email,
          password: this.password,
        }).catch(err => this.snackbarAddMessage(err.message));
      },
      updateRoute() {
        if (this.user)
          this.step = 2;
        else
          this.step = 1;
      },
      ...mapMutations('users', {clearPatchError: 'clearPatchError'}),
      ...mapMutations(['snackbarAddMessage']),
      ...mapActions('auth', ['authenticate'])
    }
  };
</script>

<style lang="stylus" scoped>
  h4
    font-size 16px
  .fake-input
    display none
  .register-panel
    max-width 600px
    flex-grow 1
</style>
