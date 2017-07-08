<template>
  <div class="outer-content">
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  export default {};
</script>

<style scoped>
  .outer-content {
    display: flex;
    overflow: auto;
  }
  .page-content {
    max-width: 920px;
    width: 90%;
    margin: 0 auto;
    padding: 24px 0;
    flex-shrink: 1;
  }
</style>
