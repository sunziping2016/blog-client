<template>
  <page-content>
    <div class="content" v-html="content">
    </div>
  </page-content>
</template>

<script lang="ts">
  import marked from 'marked';

  export default {
    data: () => ({
      content: '',
    }),
    computed: {
      path() {
        return this.$route.params.path;
      }
    },
    methods: {
      update_content() {
        this.$store.dispatch('get_file', {path: this.path.split('/').filter(x => x), type: 'file', isjson: false})
          .then(response => response.text())
          .then(body => this.content = marked(body))
          .catch(err => this.$root.refs.app.message(err.message));
      }
    },
    watch: {
      path() {
        this.update_content();
      }
    },
    mounted() {
      this.update_content();
    }
  };
</script>

<style scoped>
  .content {
    margin-bottom: 60px;
  }
</style>
