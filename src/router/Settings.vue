<template>
  <page-content>
    <md-card>
      <md-toolbar md-theme="white" class="md-dense">
        <h3 class="md-title"><md-icon>account_circle</md-icon> 账户</h3>
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
            <md-button class="item-edit md-icon-button" v-if="!edit_avatar" @click="edit_avatar=true">
              <md-icon>edit</md-icon>
            </md-button>
            <md-button class="item-edit md-icon-button" v-else @click="edit_avatar=false;leave_edit_avatar()">
              <md-icon>close</md-icon>
            </md-button>
          </transition>
        </div>
      </md-card-area>
    </md-card>
    <photo-editor ref="photo_editor"></photo-editor>
  </page-content>
</template>

<script lang="ts">
  export default {
    data: () => ({
      avatar_dropzone: {
        language: {
          dictDefaultMessage          : '上传头像',
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
    }),
    computed: {
      avatar() {
        return this.$store.getters.avatar;
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
        this.$store.dispatch('refresh_avatar', this.$store.state.session.uid)
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
  }
  .vue-dropzone .dz-preview {
    .dz-success-mark, .dz-error-mark {
      top: 55%!important;
      i {
        font-size: 65px!important;
      }
    }
  }
  .dropzone {
    padding: 0;
    border: none;
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 100%;
    &.dz-drag-hover {
      border: none;
    }
    .dz-message {
      margin: $preview-size/2-20px 0
    }
    .dz-preview {
      margin: 0;
      &:not(:hover) {
        .dz-success-mark, .dz-error-mark{
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
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
    display: flex;
    align-items: center;
    &-label {
      display: inline-block;
      min-width: 80px;
      align-self: flex-start;
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
  .md-card-area {
    padding: 24px;
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
