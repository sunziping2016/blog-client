<template>
  <textarea :value="value"></textarea>
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
    mounted: function() {
      const _this = this;
      this.editor = CodeMirror.fromTextArea(this.$el, this.options);
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

</style>
