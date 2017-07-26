<template>
  <div
    flex class="markdown-body"
    :class="markdownStyle"
    ref="content"
    v-html="markedContent">
  </div>
</template>

<script>
  import marked from 'marked';
  import hljs from 'highlight.js';

  emojify.setConfig({
    mode: 'data-uri'
  });

  export default {
    props: {
      content: {
        type: String,
        required: true
      },
      mdStyle: {
        type: String,
        default: 'github-markdown'
      }
    },
    computed: {
      markdownStyle: function () {
        return { [this.mdStyle]: true }
      },
      markedContent: function () {
        function escape(html, encode) {
          return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }
        let renderer = new marked.Renderer();
        renderer.code = function (code, lang) {
          return `<pre class="hljs${lang ? ` ${lang}`: ''}"><code>${hljs.highlightAuto(code, lang && [lang]).value}</code></pre>`;
        };
        renderer.heading = function (text, level) {
          let escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

          return `<h${level}><a name="${escapedText}" class="header-link hidden-xs-only" onclick="handleLinkClick(event);" href="#${escapedText}"></a>${text}</h${level}>`;
        };
        return marked(this.content, { renderer: renderer });
      }
    },
    methods: {
      postRender() {
        emojify.run(this.$refs.content);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.$refs.content]);
      }
    },
    watch: {
      markedContent() {
        this.postRender();
      }
    },
    mounted() {
      this.postRender();
    }
  };
</script>

<style lang="stylus">
  @import "../assets/styles/markdown-normal-style.scss";
  @import "../assets/styles/github-markdown.scss";
  @import "../assets/styles/jasonm23-dark-markdown.scss";
  @import "../assets/styles/jasonm23-foghorn-markdown.scss";
  @import "../assets/styles/jasonm23-markdown.scss";
  @import "~vuetify/src/stylus/settings/_variables.styl"

  .markdown-body {
    .MJXc-display {
      overflow-x: auto;
      overflow-y: hidden;
    }
    padding: 0 30px;
    @media $display-breakpoints.xs-only {
      padding: 0 0;
    }
  }
</style>
