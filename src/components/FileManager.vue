<template>
  <md-table-card class="file-manager">
    <md-toolbar>
      <h3 class="md-title">
        <span v-for="(dir, index) in path">/ {{dir}} </span>
        <span v-if="path.length == 0">/</span>
      </h3>
      <md-button v-if="this.path.length !== 0" class="md-icon-button" @click="pop_path()">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <md-button v-if="logined" class="md-icon-button" @click="open_upload()">
        <md-icon>cloud_upload</md-icon>
      </md-button>
      <md-button v-if="logined" class="md-icon-button" @click="folder_name = '';$refs.foldername_prompt.open()">
        <md-icon>create_new_folder</md-icon>
      </md-button>
    </md-toolbar>
    <md-table-alternate-header md-selected-label="选中">
      <md-button v-if="selected_all_file" class="md-icon-button" @click="download(selected.map(x => x.url))">
        <md-icon>file_download</md-icon>
      </md-button>
      <md-button v-if="logined" class="md-icon-button" @click="delete_files(selected)">
        <md-icon>delete</md-icon>
      </md-button>
    </md-table-alternate-header>
    <md-table @select="selected=arguments[0]" ref="table">
      <md-table-header>
        <md-table-row>
          <md-table-head>文件</md-table-head>
          <md-table-head>类型</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(file, row) in content" :key="row" :md-item="file" md-selection>
          <md-table-cell key="name" class="file-cell">
            <md-icon>
              {{file.type === 'dir' ?
              (file.name === 'public' ?
                'folder_shared' :
                'folder') :
              'insert_drive_file'
              }}
            </md-icon>
            <a :class="{folder: file.type === 'dir'}" v-if="file.type === 'dir'" href="#"
                  @click.prevent="push_path(file.name)">
              {{file.name}}
            </a>
            <a v-else class="file" :href="file.url">
              {{file.name}}
            </a>
            <div class="button-group">
              <md-button v-if="file.type !== 'dir'" class="md-icon-button" @click="download([file.url])">
                <md-icon>file_download</md-icon>
              </md-button>
              <md-button v-if="logined" class="md-icon-button" @click="delete_file(file.name)">
                <md-icon>delete</md-icon>
              </md-button>
            </div>
          </md-table-cell>
          <md-table-cell key="type" width="150px">
            {{file.type === 'dir' ?
              (file.public ?
                '公开目录' :
                '目录') :
              '普通文件'
            }}
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
    <div class="footer">
      <span class="empty" v-if="content.length === 0">（空）</span>
    </div>
    <upload-dialog :url="upload_url" :mode="mode" ref="upload"></upload-dialog>
    <md-dialog class="md-dialog-prompt" ref="foldername_prompt">
      <md-dialog-title>请输入目录名：</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <md-input type="text"
                    v-model="folder_name"
                    @keyup.enter.native="folder_name_valid && ($refs.foldername_prompt.close() || create_folder())">
          </md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="$refs.foldername_prompt.close()">取消</md-button>
        <md-button class="md-primary"
                   :disabled="!folder_name_valid"
                   @click="$refs.foldername_prompt.close();create_folder()">
          确定
        </md-button>
      </md-dialog-actions>
    </md-dialog>

  </md-table-card>
</template>

<script lang="ts">
import _ from 'lodash';

export default {
  props: {
    mode: String,
    value: Array
  },
  data: () => ({
    selected: [],
    folder_name: ''
  }),
  computed: {
    folder_name_valid() {
      return /^[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/.test(this.folder_name);
    },
    content() {
      let current = this.$store.state.file[this.mode];
      for (let i of this.path)
        current = current.content[i];
      current = current.content;
      let list_content = Object.keys(current).map(x => ({
        name:x, type: current[x].dir ? 'dir' : 'file',
        'public': this.path[0] === 'public' || (this.path.length === 0 && x === 'public'),
        url: `${this.$store.state.api.site}/${['file'].concat(this.path).join('/')}/${x}?mode=${this.mode}&type=${current[x].dir ? 'dir' : 'file'}`,
      }));
      return list_content = _.sortBy(list_content, ['type', 'name']);

    },
    path() {
      return this.value;
    },
    selected_all_file() {
      return this.selected.every(x => x.type === 'file');
    },
    logined() {
      return this.$store.getters.logined;
    },
    upload_url() {
      return `${this.$store.state.api.site}/${['file'].concat(this.path).join('/')}/`
    },
  },
  methods: {
    push_path(path) {
      let new_path = this.path.slice();
      new_path.push(path);
      this.$emit('input', new_path);
    },
    pop_path() {
      let new_path = this.path.slice();
      new_path.pop();
      this.$emit('input', new_path);
    },
    download(urls) {
      for (let url of urls)
        window.open(url);
    },
    open_upload() {
      this.$refs.upload.open();
      this.$refs.upload.$on('close', () => {
        this.$emit('input', this.path);
      });
    },
    create_folder() {
      this.$refs.foldername_prompt.open();
      let new_path = this.path.slice();
      new_path.push(this.folder_name);
      this.$store.dispatch('create_dir', {mode: this.mode, path: new_path})
        .catch(err => this.$root.$refs.app.message(err.message))
        .then(() => this.$emit('input', this.path));

    },
    delete_file(file) {
      let new_path = this.path.slice();
      new_path.push(file);
      this.$store.dispatch('delete_file', {mode: this.mode, path: new_path})
        .catch(err => this.$root.$refs.app.message(err.message))
        .then(() => this.$emit('input', this.path));
    },
    delete_files(files) {
      Promise.all(files.map(file => {
        let new_path = this.path.slice();
        new_path.push(file.name);
        return this.$store.dispatch('delete_file', {mode: this.mode, path: new_path});
      }))
        .catch(err => this.$root.$refs.app.message(err.message))
        .then(() => {
          this.$emit('input', this.path);
          let checkbox = this.$refs.table.$el.querySelector('input');
          if (checkbox.value)
            checkbox.parentElement.click();
        });
    }
  },
};
</script>

<style lang="scss">
  .file-manager {
    .md-toolbar {
      min-height: 56px;
    }
  }
  .md-table-row {
    .file-cell .md-table-cell-container {
      padding-right: 12px !important;
      & > .md-icon {
        width: 18px;
        height: 18px;
        min-width: 18px;
        min-height: 18px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.54);
        flex-grow: 0;
        margin: 0 8px 0 0;
      }
      & > a {
        flex-grow: 0;
        margin: 2px 0 0;
        font-size: 13px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.54);
        &.folder {
          cursor: pointer;
        }
      }
      & > .button-group {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        .md-button {
          padding: 0;
          width: 18px;
          height: 18px;
          min-width: 18px;
          min-height: 18px;
        }
      }
    }
    &:hover .file-cell .md-table-cell-container {
      & > .button-group {
        opacity: 1;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    .empty {
      font-size: 13px;
      line-height: 18px;
      margin: 20px;
      color: rgba(0, 0, 0, 0.54);
    }
  }
</style>
