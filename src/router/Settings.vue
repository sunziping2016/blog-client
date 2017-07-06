<template>
  <page-content>
    <md-card>
      <md-toolbar md-theme="white" class="md-dense">
        <h3 class="md-title">账户</h3>
      </md-toolbar>
      <md-card-area class="account-settings">
        <div class="item">
          <h4 class="item-label">头像</h4>
          <md-whiteframe md-elevation="1" class="item-data avatar-dropzone">
            <dropzone id="avatar-dropzone"
                      :url="$store.state.api.site + '/file'"
                      :dropzone-options="avatar_dropzone"
                      :use-custom-dropzone-options="true"
                      :thumbnail-width="150" :thumbnail-height="150"
                      @vdropzone-file-added="add_file(arguments[0])"
                      @vdropzone-thumbnail="$refs.photo_editor.open(arguments[0].dataURL)"
                      @vdropzone-removed-file="remove_file()"
                      ref="avatar_dropzone">
            </dropzone>
          </md-whiteframe>
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
          dictInvalidFileType         : `不支持的格式`,
          dictMaxFilesExceeded        : '到达文件数目上线 最多{{maxFiles}}',
          dictRemoveFile              : '',
          dictRemoveFileConfirmation  : null,
          dictResponseError           : '服务器返回了{{statusCode}}'
        },
        acceptedFileTypes: 'image/jpeg,image/png,image/gif',
        autoProcessQueue: false,
        resizeMimeType: 'image/jpeg',
        resizeWidth: 128,
        resizeHeight: 128,
        useFontAwesome: false,
        maxNumberOfFiles: 1,
        maxFileSizeInMB: 5
      },
      had_file: false,
      avatar: null
    }),
    computed: {
      accepted_file_type_list() {
        return this.avatar_dropzone.acceptedFileTypes.split(',');
      }
    },
    methods: {
      add_file(file) {
        if (this.had_file || this.accepted_file_type_list.indexOf(file.type) === -1)
          this.$refs.avatar_dropzone.removeFile(file);
        else
          this.had_file = true;
      },
      remove_file() {
        this.had_file = false;
      }
    }
  };
</script>

<style lang="scss">
  $preview-size: 150px;
  .avatar-dropzone {
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
  .md-card-area {
    padding: 24px;
  }
</style>
