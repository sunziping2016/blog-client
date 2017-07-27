<template>
  <div class="editor-container">
    <div>
      <codemirror ref="myEditor"
                  v-model="code"
                  :options="editorOptions">
      </codemirror>
    </div>
    <div v-if="true">
      <markdown-viewer :content="renderedCode" :config="viewerConfiguer"></markdown-viewer>
    </div>
  </div>
</template>

<script>
  import body from './hello.txt';
  import debounce from 'lodash.debounce'

  // Similarly, you can also introduce the resource pack you want to use within the component
  // require('codemirror/some-resource')
  export default {
    data () {
      return {
        code: body,
        renderedCode: body,
        sizeEventListener: null,
        editorOptions: {
          // codemirror options
          tabSize: 4,
          mode: 'text/x-markdown',
          lineNumbers: true,
          line: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
          // more codemirror config...
          // 如果有hint方面的配置，也应该出现在这里
        },
        viewerConfiguer: {
          setSrcDirectory: originalSrc => 'hhh/' + originalSrc
        }
      }
    },
    watch: {
      code: debounce(
        function () {
          this.renderedCode = this.code;
        }, 500)
    },
    computed: {
      editor() {
        return this.$refs.myEditor.editor
      }
    },
  }
</script>

<style lang="stylus">
  @import "~vuetify/src/stylus/settings/_variables.styl"

  .editor-container
    display flex
    height 100%
    & > div
      width 50%
      height 100%
      overflow-y auto
    .CodeMirror
      height 100%

    .markdown-body {
      padding: 20px 30px
      @media $display-breakpoints.xs-only {
        padding: 20px;
      }
    }
</style>
