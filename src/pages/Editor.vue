<template>
  <div class="markdown-editor">
    <codemirror ref="myEditor"
                :code="code"
                :options="editorOptions"
                @change="onEditorCodeChange">
    </codemirror>
  </div>
</template>

<script>
  import body from './hello.txt';

  // Similarly, you can also introduce the resource pack you want to use within the component
  // require('codemirror/some-resource')
  export default {
    data () {
      return {
        code: body,
        sizeEventListener: null,
        editorOptions: {
          // codemirror options
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true,
          // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
          keyMap: "basic",
          // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
          extraKeys: { "Ctrl": "autocomplete" },
          // 代码折叠
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
          // more codemirror config...
          // 如果有hint方面的配置，也应该出现在这里
        }
      }
    },
    methods: {
      onEditorCodeChange(newCode) {
        console.log('this is new code', newCode);
        this.code = newCode
      }
    },
    computed: {
      editor() {
        return this.$refs.myEditor.editor
      }
    },
    mounted() {
      console.log('this is current editor object', this.editor);
      // you can use this.editor to do something..
//      this.editor.setSize(null, this.$el.clientHeight);
//      this.sizeEventListener = window.addEventListener('resize', () => {
//        this.editor.setSize(null, this.$el.clientHeight);
//      });
    }
  }
</script>

<style lang="stylus">
  .markdown-editor
    height 100%
    .CodeMirror
      height 100%
</style>
