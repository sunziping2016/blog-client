<template>
  <v-snackbar v-model="snackbar"
              :timeout="message.timeout">
    {{ message.content }}
    <v-btn flat
           :class="message.action_class"
           @click.native="handleClick">
      {{ message.action_text }}
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
  import { mapMutations } from 'vuex';
  import bus from '@/event-bus';
  import _extend from 'lodash/fp/extend.js';

  //noinspection TypeScriptValidateTypes
  export default {
    methods: {
      ...mapMutations({
        close: 'snackbarClose',
        nextMessage: 'snackbarNextMessage',
        snackbarSet: 'snackbarSet'
      }),
      handleClick() {
        bus.$emit(`app-snackbar:${this.message.action}`);
      }
    },
    computed: {
      message: function () {
        return _extend({
          content: '',
          action: 'close',
          action_text: 'Close',
          action_class: 'pink--text',
          timeout: 6000
        }, this.$store.state.snackbar.snackbar_messages[0]);
      },
      snackbar: {
        get(): boolean {
          return this.$store.state.snackbar.snackbar;
        },
        set(value: boolean): void {
          this.snackbarSet(value);
        }
      }
    },
    watch: {
      snackbar(value) {
        if (!value)
          setTimeout(this.nextMessage, 400);
      }
    },
    mounted() {
      bus.$on('app-snackbar:close', () => this.snackbarSet(false));
      bus.$on('app-snackbar:refresh', () => {
        this.snackbarSet(false);
        setTimeout(() => location.reload(), 400);
      });
      this.$store.watch(state => state.app.new_version_available, value => {
        this.$store.commit('snackbarAddMessage', {
          content: '已更新至最新版本',
          action: 'refresh',
          action_text: '点击刷新',
          action_class: 'yellow--text',
          timeout: 10000
        });
      })
    }
  };
</script>
