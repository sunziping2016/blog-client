<template>
  <md-dialog ref="dialog" @close="$emit('close');" class="file-upload">
    <md-dialog-title>上传文件</md-dialog-title>
    <md-dialog-content>
      <dropzone :id="`${mode}-dropzone`"
                :url="url" ref="dropzone"
                :dropzone-options="options"
                :use-custom-dropzone-options="true"
                :thumbnail-width="150" :thumbnail-height="150">
        <input type="hidden" name="mode" :value="mode">
        <input type="hidden" name="type" value="file">
      </dropzone>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="close()">完成</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
  export default {
    props: {
      url: String,
      mode: String
    },
    watch: {
      url() {
        this.$refs.dropzone.dropzone.options.url = this.url;
      }
    },
    data: () => ({
      options: {
        language: {
          dictDefaultMessage          : '<br>上传文件',
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
        autoProcessQueue: true,
        useFontAwesome: false,
        maxFileSizeInMB: 50,
        paramName: 'file',
      },
    }),
    methods: {
      open() {
        this.$refs.dialog.open();
      },
      close() {
        this.$refs.dialog.close();
      }
    },
  };
</script>

<style lang="scss">
  $preview-size: 150px;
  .file-upload .md-dialog {
    min-width: 80%;
    min-height: 80%;
    .md-dialog-title {
      max-height: 32px;
      box-sizing: content-box!important;
    }
    .md-dialog-content {
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }
  }
  .vue-dropzone.dropzone {
    position: relative;
    padding: 0;
    border: none;
    width: 100%;
    height: 100%;
    min-height: 100%;
    flex-grow: 1;
  &.dz-drag-hover {
     border: none;
   }
  .dz-message {
    margin-top: 200px;
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
</style>
