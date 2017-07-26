<template>
  <textarea
    class="markdown-editor"
    ref="content"
    :value="value"
    @input="input"
  >
  </textarea>
</template>

<script>
  export default{
    props: {
      value: {
        type: String,
      },
      editStyle: {
        type: String,
      }
    },
    computed:{
    },
    methods: {
      input() {
          console.log('changed');
      }
    },
    mounted(){
      var myCodeMirror = CodeMirror.fromTextArea(this.$refs.content, {
        lineNumbers: true,
        mode: 'markdown'
      });
    }
  }
</script>
