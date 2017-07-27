<template>
  <div class="edit-page">
    <div class="editor-viewer"
         :class="{'hasno-preview': !preview}">
      <div class="editor-panel">
        <codemirror ref="myEditor"
                    v-model="code"
                    :options="editorOptions">
        </codemirror>
      </div>
      <transition duration="300">
        <div class="viewer-panel" v-if="preview">
            <markdown-viewer :content="renderedCode" :config="viewerConfiguer"></markdown-viewer>
        </div>
      </transition>
    </div>
    <v-card class="editor-config">
      <v-speed-dial
        v-model="menuButtonClicked"
        :right="true"
        :bottom="true"
        transition="slide-y-reverse-transition"
      >
        <v-btn
          slot="activator"
          class="blue darken-2"
          dark
          fab
          hover
          v-model="menuButtonClicked"
        >
          <v-icon>list</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          class="indigo"
          @click.native="previewButtonClick"
          v-model="preview"
        >
          <v-icon>visibility</v-icon>
          <v-icon>visibility_off</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          class="red"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-card>
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
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
          // more codemirror config...
          // 如果有hint方面的配置，也应该出现在这里
        },
        viewerConfiguer: {
          setSrcDirectory: originalSrc => 'hhh/' + originalSrc
        },
        menuButtonClicked: false,
        preview: !matchMedia('only screen and (max-width: 599px)').matches
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
    methods: {
      previewButtonClick(){
        this.preview = !this.preview;
      }
    }
  }
</script>

<style lang="stylus">
  @import "~vuetify/src/stylus/settings/_variables.styl"

  .edit-page
    height:100%
    .editor-config
      box-shadow none
      background-color transparent
      position absolute
      bottom 20px
      right 20px
      z-index 1
      .btn--floating .icon
        left auto
        top auto

  .editor-viewer
    white-space nowrap
    height 100%
    .editor-panel, .viewer-panel
      white-space normal
      overflow-y auto
      width 50%
      height 100%
      margin -2px
      display inline-block
      @media $display-breakpoints.xs-only
        width 100%
    .editor-panel
      transition all 0.3s ease
      @media $display-breakpoints.xs-only
        margin-left -100%
    &.hasno-preview
      .editor-panel
        width 100%
        margin-left 0
    .CodeMirror
      z-index 0
      height 100%
    .markdown-body
      padding: 20px 30px
      @media $display-breakpoints.xs-only
        padding: 20px
</style>
