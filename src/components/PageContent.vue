<template>
  <div class="page-content">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  export default {};
</script>

<style scoped>
  .page-content {
    padding: 12px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-self: center;
    max-width: 920px;
    width: 100%;
  }
</style>
