<template>
  <div class="editor-container">
    <div>
      <codemirror ref="myEditor"
                  :value="code"
                  :options="editorOptions"
                  @change="onEditorCodeChange">
      </codemirror>
    </div>
    <div>
      <markdown-viewer :content="renderedCode" :config="viewerConfiguer"></markdown-viewer>
    </div>
  </div>
</template>

<script>
  import body from './hello.txt';
  import debounce from 'lodash/debounce.js'

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
          keyMap: "basic",
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
    methods: {
      onEditorCodeChange(newCode) {
        console.log('before change');
        this.code = newCode;
        this.updateCode();
      },
      updateCode: debounce(
        function () {
          console.log('debounce');
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
  .editor-container
    display flex
    height 100%
    & > div
      width 50%
      height 100%
      overflow-y auto
    .CodeMirror
      height 100%
</style>
