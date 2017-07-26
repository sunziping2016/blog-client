<template>
  <v-container
    flex class="markdown-body"
    :class="{'github-markdown': true}"
    ref="content"
    v-html="content">
  </v-container>
</template>

<script>
  import body from './hello.txt';
  import marked from 'marked';
  import hljs from 'highlight.js';

  emojify.setConfig({
    mode: 'sprite'
  });

  export default {
    data: () => ({
      content: '',
      id: 'math-markdown'
    }),
    methods: {
      updateContent() {
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

          return `<h${level}><a name="${escapedText}" class="header-link" onclick="handleLinkClick(event);" href="#${escapedText}"></a>${text}</h${level}>`;
        };
        this.content = marked(body, { renderer: renderer });
      }
    },
    created() {
      this.updateContent();
    },
    mounted() {
      emojify.run(this.$refs.content);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.$refs.content]);
    }
  };
</script>

<style lang="scss">
  @import "../assets/styles/markdown-normal-style.scss";
  @import '../assets/styles/github-markdown.scss';
  @import '../assets/styles/jasonm23-dark-markdown.scss';
  @import '../assets/styles/jasonm23-foghorn-markdown.scss';

  .markdown-body {
    max-width: 920px;
    padding-left: 35px;
  }
</style>
