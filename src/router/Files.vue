<template>
  <page-content>
    <md-card class="md-table-card">
      <md-toolbar md-theme="white" class="md-dense">
        <h3 class="md-title">文件浏览</h3>
      </md-toolbar>
      <md-card-area>
        <md-tabs md-right :md-dynamic-height="false"
                 class="md-transparent file-tabs" ref="file_tabs">
          <md-tab  md-label="个人" :md-active="logined && this.mode === 'private'"
                   :mdDisabled="!logined && this.mode === 'share'">
            <file-manager mode="private" :value="private_path"
                          @input="change_path('private', arguments[0])">
            </file-manager>
          </md-tab>
          <md-tab md-label="共享" :md-active="!logined || this.mode === 'share'">
            <file-manager mode="share" :value="share_path"
                          @input="change_path('share', arguments[0])">
            </file-manager>
          </md-tab>
        </md-tabs>
      </md-card-area>
    </md-card>
  </page-content>
</template>

<script lang="ts">
  export default {
    data: () => ({
      mode: 'private',
      private_path: [],
      share_path: []
    }),
    computed: {
      logined() {
        return this.$store.getters.logined;
      }
    },
    mounted() {
      let mode = this.$route.params.mode, path = this.$route.params.path.split('/').filter(x => x);
      if (!this.logined && mode === 'private') {
        this.$router.push('/files/share/');
        return;
      }
      this.$store.dispatch('update_dir', {mode, path})
        .then(() => {
          this.mode = mode;
          this[mode + '_path'] = path;
        })
        .catch(err => this.handle_error(err, mode));
      this.$refs.file_tabs.$on('change', i => {
        let mode=['private','share'][i];
        this.$router.push(`/files/${mode}/${this[mode + '_path'].join('/')}`);
      });
    },
    methods: {
      handle_error(err, mode) {
        switch (err.message) {
          case 'Not found':
            this.$root.$refs.app.message('文件不存在');
            this.$router.replace(`/files/${mode}/`);
            break;
          default:
            this.$root.$refs.app.message(err.message);
        }
      },
      change_path(mode, path) {
        this.$store.dispatch('update_dir', {mode, path})
          .then(() => this.$router.push(`/files/${mode}/${path.join('/')}`))
          .catch(err => this.handle_error(err, mode));
      }
    },
    watch: {
      $route(to, from) {
        let mode = to.params.mode, path = to.params.path.split('/').filter(x => x);
        if (!this.logined && mode === 'private') {
          this.$router.replace('/files/share/');
          return;
        }
        this.$store.dispatch('update_dir', {mode, path})
          .then(() => {
            this.mode = mode;
            this[mode + '_path'] = path;
          })
          .catch(err => this.handle_error(err, mode));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-title {
    position: relative;
    z-index: 3;
  }
  .file-tabs {
    margin-top: -48px;
  }
</style>
