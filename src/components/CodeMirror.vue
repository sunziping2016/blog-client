<template>
  <textarea></textarea>
</template>

<script>
  export default {
    name: 'codemirror',
    data: function() {
      return {
      };
    },
    props: {
      value: String,
      unseenLines: Array,
      marker: Function,
      debugger: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        required: true
      },
    },
    created: function() {
      if (this.options.lineNumbers === undefined) {
        this.options.lineNumbers = true;
      }
      if (this.options.lineWrapping === undefined) {
        this.options.lineWrapping = false;
      }
      if (this.options.mode === undefined) {
        this.options.mode = 'text/javascript';
      }

      let theme = this.options.theme;
      let language = this.options.mode;
      let isCustomMode = !!CodeMirror.modes[language];

      // language string config
      if (typeof language === 'string') {
        let lang = CodeMirror.findModeByMIME(language);
        language = !lang ? lang : lang.mode
        // language object config
      } else if (typeof language === 'object') {
        if (language.name) {
          let lang = CodeMirror.findModeByName(language.name);
          if (lang) {
            language = lang.mode
          } else {
            language = null
          }
        } else if (language.ext) {
          let lang = CodeMirror.findModeByExtension(language.ext);
          if (lang) {
            language = lang.mode
          } else {
            language = null
          }
        } else if (language.mime) {
          let lang = CodeMirror.findModeByMIME(language.mime);
          if (lang) {
            language = lang.mode
          } else {
            language = null
          }
        } else if (language.filename) {
          let lang = CodeMirror.findModeByFileName(language.filename);
          if (lang) {
            language = lang.mode
            // this.options.mode = language
          } else {
            language = null
          }
        }
      }

      if ((!language || language === 'null') && !isCustomMode) {
        console.warn('CodeMirror language mode: ' + language + ' configuration error (CodeMirror语言模式配置错误，或者不支持此语言) See http://codemirror.net/mode/ for more details.')
      }
    },
    mounted: function() {
      const _this = this;
      this.editor = CodeMirror.fromTextArea(this.$el, this.options);
      this.editor.setValue(this.value);
      this.editor.on('change', function(cm) {
        let content = cm.getValue();
        if (!!_this.$emit) {
          _this.$emit('change', content);
          _this.$emit('input', content);
        }
      });
      const events = [
        'changes',
        'beforeChange',
        'cursorActivity',
        'keyHandled',
        'inputRead',
        'electricInput',
        'beforeSelectionChange',
        'viewportChange',
        'swapDoc',
        'gutterClick',
        'gutterContextMenu',
        'focus',
        'blur',
        'refresh',
        'optionChange',
        'scrollCursorIntoView',
        'update'
      ];
      for (let i = events.length - 1; i >= 0; i--) {
        (function(event) {
          _this.editor.on(event, function(a, b, c) {
            _this.$emit(event, a, b, c)
          })
        })(events[i])
      }
      this.$emit('ready', this.editor);
      this.unseenLineMarkers();

      // prevents funky dynamic rendering
      window.setTimeout(function() {
        _this.editor.refresh()
      }, 0)
    },
    beforeDestroy: function() {
      this.editor.doc.cm.getWrapperElement().remove()
    },
    watch: {
      options: {
        deep: true,
        handler(options, oldOptions) {
          for (let key in options) {
            this.editor.setOption(key, options[key]);
          }
        }
      },
      value: function(newVal, oldVal) {
        const editor_value = this.editor.getValue();
        if (newVal !== editor_value) {
          const scrollInfo = this.editor.getScrollInfo();
          this.editor.setValue(newVal);
          this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
        }
        this.unseenLineMarkers();
      }
    },
    methods: {
      refresh: function() {
        this.editor.refresh();
      },
      unseenLineMarkers: function () {
        let _this = this;
        if (_this.unseenLines !== undefined && _this.marker !== undefined) {
          _this.unseenLines.forEach(line => {
            let info = _this.editor.lineInfo(line);
            _this.editor.setGutterMarker(line, "breakpoints", info.gutterMarkers ? null : _this.marker());
          });
        }
      }
    }
  }
</script>

<style lang="stylus">
  .CodeMirror-vscrollbar
    z-index 3
</style>
