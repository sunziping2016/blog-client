<template>
  <v-container fluid>
    <v-layout row justify-space-around>
      <v-card class="settings-panel elevation-1">
        <v-card-title class="headline">账户</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>头像</v-subheader>
              </v-flex>
              <v-flex xs8>
                <div class="avatar-dropzone elevation-1">
                  <img v-if="!!user.avatar && !editAvatar" :src="user.avatar" alt="avatar">
                  <dropzone v-else
                            :url="`/users/${user._id}`"
                            :dropzone-options="avatarDropzone"
                            :use-custom-dropzone-options="true"
                            :thumbnail-width="150" :thumbnail-height="150"
                            ref="avatarDropzone">
                  </dropzone>
                </div>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>昵称</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  disabled
                  value="12313"
                  :append-icon="'edit'"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>邮箱</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  disabled
                  :value="user.email"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'settings',
    data() {
      return {
        editAvatar: false,
        editNickname: false,
        editedNickname: '',
        editedPassword: '',
        avatarDropzone: {
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
      }
    },
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    }
  };
</script>


<style lang="stylus" scoped>
  .settings-panel
    max-width 600px
    flex-grow 1
    overflow auto

  .text-item
    height 34px
    line-height 34px
    font-size 16px
    padding 0
    margin 0 0 20px;
</style>

<style lang="stylus">
  .settings-panel
    .container
      padding 0
    .input-group
      margin 2px 0
    .subheader
      height 34px
      line-height 34px
      font-size: 16px

  $preview-size = 150px;
  .avatar-dropzone {
    width: $preview-size;
    height: $preview-size;
    margin: 8px 0 20px;
    & > img {
      width: $preview-size;
      height: $preview-size;
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
      width: 100%;
      height: 100%;
      min-height: 100%;
      &.dz-drag-hover {
        border: none;
      }
      .dz-message {
        margin 0
        padding: 50px 0;
      }
      .dz-preview {
        margin: 0!important;
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
  }
</style>
