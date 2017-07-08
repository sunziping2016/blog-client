<template>
  <page-content>
    <md-card>
      <md-toolbar md-theme="white" class="md-dense">
        <h3 class="md-title">账户</h3>
      </md-toolbar>
      <md-card-area class="account-settings">
        <div class="item">
          <h4 class="item-label md-subheading md-primary">头像</h4>
          <md-whiteframe md-elevation="1" class="item-data avatar-dropzone">
            <transition name="fade" mode="out-in">
              <img v-if="!!avatar && !edit_avatar" :src="avatar" alt="avatar">
              <dropzone v-else id="avatar-dropzone"
                        :url="$store.state.api.site + '/api/user-update'"
                        :dropzone-options="avatar_dropzone"
                        :use-custom-dropzone-options="true"
                        :thumbnail-width="150" :thumbnail-height="150"
                        @vdropzone-thumbnail="file_ready(arguments[0])"
                        @vdropzone-error="!arguments[0].sending && $refs.avatar_dropzone.removeFile(arguments[0])"
                        @vdropzone-sending="arguments[1].withCredentials=true"
                        @vdropzone-success="uploading_finished()"
                        ref="avatar_dropzone">
              </dropzone>
            </transition>
          </md-whiteframe>
          <transition name="fade" mode="out-in">
            <md-button class="item-edit md-icon-button" v-if="!!avatar && !edit_avatar" @click="edit_avatar=true">
              <md-icon>edit</md-icon>
            </md-button>
            <md-button class="item-edit md-icon-button" v-else-if="!!avatar" @click="edit_avatar=false;leave_edit_avatar()">
              <md-icon>close</md-icon>
            </md-button>
          </transition>
        </div>
        <div class="item">
          <h4 class="item-label md-subheading md-primary">用户名</h4>
          <span v-if="!edit_username" class="inline-text">{{username}}</span>
          <md-input-container v-else md-inline class="inline-text">
            <md-input type="text" :value="username"
                      @keyup.enter.native="change_username()"
                      @input="edited_username=arguments[0]"></md-input>
          </md-input-container>
          <transition name="fade" mode="out-in">
            <md-button class="item-edit md-icon-button" v-if="!edit_username" @click="edit_username=true">
              <md-icon>edit</md-icon>
            </md-button>
            <md-button class="item-edit md-icon-button" v-else @click="edit_username=false;">
              <md-icon>close</md-icon>
            </md-button>
          </transition>
        </div>
        <div class="item">
          <h4 class="item-label md-subheading md-primary">密码</h4>
          <span class="inline-text">********</span>
          <md-button class="item-edit md-icon-button" @click="edited_password='';$refs.password_prompt.open()">
            <md-icon>edit</md-icon>
          </md-button>
        </div>
      </md-card-area>
    </md-card>
    <photo-editor ref="photo_editor"></photo-editor>
    <md-dialog class="md-dialog-prompt" ref="password_prompt">
      <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->
      <input style="display:none" type="text" name="fakeusernameremembered">
      <input style="display:none" type="password" name="fakepasswordremembered">
      <md-dialog-title>请输入新密码：</md-dialog-title>
      <md-dialog-content>
        <md-input-container md-has-password>
          <md-input type="password"
                    v-model="edited_password"
                    @keyup.enter.native="edited_password_valid && ($refs.password_prompt.close() || change_password())">
          </md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="$refs.password_prompt.close()">取消</md-button>
        <md-button class="md-primary"
                   :disabled="!edited_password_valid"
                   @click="$refs.password_prompt.close();change_password()">
          确定
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </page-content>
</template>

<script lang="ts">
  export default {
    data: () => ({
      avatar_dropzone: {
        language: {
          dictDefaultMessage          : '<br>上传头像',
          dictCancelUpload            : '',
          dictCancelUploadConfirmation: '确定要取消上传么?',
          dictFallbackMessage         : '浏览器不支持拖拽',
          dictFallbackText            : '请使用下方的表单',
          dictFileTooBig              : '文件太大{{filesize}}MiB 最大{{maxFilesize}}MiB',
          dictInvalidFileType         : '不支持的格式',
          dictMaxFilesExceeded        : '到达文件数目上线 最多{{maxFiles}}',
          dictRemoveFile              : '',
          dictRemoveFileConfirmation  : null,
          dictResponseError           : '服务器返回了{{statusCode}}'
        },
        acceptedFileTypes: 'image/jpeg,image/png,image/gif',
        autoProcessQueue: false,
        resizeMimeType: 'image/jpeg',
        useFontAwesome: false,
        maxNumberOfFiles: 1,
        maxFileSizeInMB: 5,
        paramName: 'avatar',
        showRemoveLink: false
      },
      edit_avatar: false,
      edit_username: false,
      edited_username: '',
      edited_password: '',
    }),
    computed: {
      avatar() {
        return this.$store.getters.avatar;
      },
      username() {
        return this.$store.getters.username;
      },
      edited_password_valid() {
        return this.edited_password !== '';
      }
    },
    methods: {
      file_ready(file) {
        if (!file.accepted)
            return;
        if (file.sending) {
          this.$refs.avatar_dropzone.dropzone.processQueue();
          return;
        }
        this.$refs.photo_editor.open(file.dataURL, {
          autoCrop: true,
          viewMode: 2,
          aspectRatio: true,
        });
        this.$refs.photo_editor.$once('close', status => {
          if (status === false) {
            this.$refs.avatar_dropzone.removeFile(file);
            this.edit_avatar = false;
          } else {
            this.$refs.avatar_dropzone.removeFile(file);
            const blob = this.dataURItoBlob(status.toDataURL('image/jpeg'));
            blob.name = file.name;
            blob.sending = 'edited';
            this.$refs.avatar_dropzone.dropzone.addFile(blob);
          }
        })
      },
      uploading_finished() {
        this.$store.dispatch(this.avatar === undefined ? 'update_user' : 'refresh_avatar',
          this.$store.state.session.uid)
          .then(() => this.leave_edit_avatar())
          .catch(err => {
            this.$root.$refs.app.message(err.message);
          });
      },
      leave_edit_avatar() {
        let files = this.$refs.avatar_dropzone.getAcceptedFiles();
        for (let file of files)
          this.$refs.avatar_dropzone.removeFile(file);
        this.edit_avatar = false;
      },
      dataURItoBlob(dataURI) {
        let byteString, mimestring;

        if(dataURI.split(',')[0].indexOf('base64') !== -1 )
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = decodeURI(dataURI.split(',')[1]);

        mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

        let content = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          content[i] = byteString.charCodeAt(i)
        }
        return new Blob([content], {type: mimestring});
      },
      change_username() {
        this.$store.dispatch('user_modify', {username: this.edited_username})
          .then(() => this.$store.dispatch('update_user', this.$store.state.session.uid))
          .catch(err => {
            this.$root.$refs.app.message(err.message);
          })
          .then(() => this.edit_username=false);
      },
      change_password() {
        this.$store.dispatch('user_modify', {password: this.edited_password})
          .then(() => this.$store.dispatch('update_user', this.$store.state.session.uid))
          .catch(err => {
            this.$root.$refs.app.message(err.message);
          });
      }
    }
  };
</script>

<style lang="scss">
  $preview-size: 150px;
  .avatar-dropzone {
    width: $preview-size;
    height: $preview-size;
    & > img {
      width: $preview-size;
      height: $preview-size;
    }
    margin: 8px 0;
  }
  .vue-dropzone .dz-preview {
    .dz-success-mark, .dz-error-mark {
      top: 55%!important;
      i {
        font-size: 65px!important;
      }
    }
  }
  .vue-dropzone.dropzone {
    padding: 0!important;
    border: none!important;
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 100%;
    &.dz-drag-hover {
      border: none;
    }
    .dz-message {
      margin: $preview-size/2-20px 0;
    }
    .dz-preview {
      margin: 0!important;
      &:not(:hover) {
        .dz-success-mark, .dz-error-mark{
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.6);;
        }
        .dz-progress {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
        }
        .dz-success-mark {
          opacity: 0;
        }
      }
      .dz-image img {
        width: $preview-size;
      }
      .dz-progress {
        top: 60%;
      }
      .dz-error-message {
        top: 70%;
      }
      .dz-remove {
        visibility: hidden;
        top: -8px;
        right: -8px;
        left: auto;
        bottom: auto;
        &:after {
          content: '\e5cd';
          visibility: visible;
          font-family: 'Material Icons';
          font-weight: bold;
          font-size: 36px; /* Preferred icon size */
          display: inline-block;
          line-height: 1;
          white-space: nowrap;
          direction: ltr;

          /* Support for all WebKit browsers. */
          -webkit-font-smoothing: antialiased;
          /* Support for Safari and Chrome. */
          text-rendering: optimizeLegibility;
          /* Support for Firefox. */
          -moz-osx-font-smoothing: grayscale;
          /* Support for IE. */
          font-feature-settings: 'liga';
        }
      }
    }
  }
  .item {
    margin: 24px;
    display: flex;
    align-items: center;
    &-label.md-subheading {
      display: inline-block;
      min-width: 80px;
      align-self: flex-start;
      line-height: 40px;
    }
    &-edit {
      opacity: 0;
    }
    &:hover {
      .item-edit {
        opacity: 1;
      }
    }
  }
  .inline-text {
    margin: 0;
    padding: 0;
    min-height: 32px;
    font-size: 16px;
    line-height: 32px;
    &.md-input-container {
      margin: 0;
      padding: 0;
      min-height: 32px;
      font-size: 16px;
      line-height: 32px;
      max-width: 150px;
    }
  }
  .fade-enter-active {
    transition: all .15s linear;
  }
  .fade-leave-active {
    transition: all .15s linear;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
