<template>
  <md-dialog ref="dialog" @close="$emit('close', published);">
    <md-dialog-title>发布文章</md-dialog-title>
    <md-dialog-content>
      <form>
        <md-input-container>
          <label>标题</label>
          <md-input type="text" required v-model="title" @keyup.enter.native.prevent="valid && publish()"></md-input>
        </md-input-container>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="close()">取消</md-button>
      <md-button class="md-primary" @click="publish()" :disabled="!valid">发布</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
  export default {
    data: () => ({
      published: false,
      title: '',
      url: '',
    }),
    computed: {
      valid() {
        return this.title.length !== 0;
      }
    },
    methods: {
      open(url) {
        this.url = url;
        this.$refs.dialog.open();
      },
      close() {
        this.$refs.dialog.close();
      },
      publish() {
        this.$store.dispatch('add_post', {title:this.title, path:this.url, owner: this.$store.state.session.uid})
          .then(id => this.$store.dispatch('update_post', id))
          .then(() => this.published = true)
          .catch(err => this.$root.$refs.app.message(err.message))
          .then(()=> this.close());
      }
    }
  };
</script>

<style scoped>
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }
</style>
