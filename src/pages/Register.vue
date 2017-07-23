<template>
  <v-container fluid>
    <!-- Fake elements -->
    <input class="fake-input" type="email">
    <input class="fake-input" type="password">
    <v-stepper :value="step" vertical non-linear>
      <v-stepper-step step="1" :complete="step > 1">注册</v-stepper-step>
      <v-stepper-content step="1">
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
        <v-btn flat @click.native="$router.back()">取消</v-btn>
        <v-btn primary
               :disabled="!registerValid"
               @click.native="onRegister">
          注册
        </v-btn>
      </v-stepper-content>
      <v-stepper-step step="2" :complete="step > 2">验证邮箱</v-stepper-step>
      <v-stepper-content step="2">
        <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px"></v-card>
        <v-btn primary>Continue</v-btn>
        <v-btn flat>取消</v-btn>
      </v-stepper-content>
      <v-stepper-step step="3">完成</v-stepper-step>
      <v-stepper-content step="3">
        <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px"></v-card>
        <v-btn primary>Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
  import { mapMutations, mapActions, mapState } from 'vuex';
  import debounce from 'lodash/debounce.js';

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default {
    name: 'register',
    data() {
      return {
        email: '',
        password: '',
        passwordVisible: false,
        emailError: null,
        passwordError: null
      }
    },
    computed: {
      registerValid() {
        return this.email && this.password &&
          !this.emailError && !this.passwordError;
      },
      step() {
        return this.user ? (this.user.validated ? 3 : 2) : 1;
      },
      ...mapState('auth', ['user'])
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
      onRegister: debounce(function () {
        if (!this.registerValid)
          return;
        this.clearCreateError();
        this.createUser({email: this.email, password: this.password})
          .then(response => this.authenticate({
            strategy: 'local',
            email: this.email,
            password: this.password
          }))
          .then(() => this.snackbarAddMessage('注册成功'))
          .catch(error => {
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
      ...mapActions('users', {createUser: 'create'}),
      ...mapMutations('users', {clearCreateError: 'clearCreateError'}),
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
  .container
    max-width: 600px
</style>
