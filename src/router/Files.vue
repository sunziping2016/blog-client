<template>
  <page-content>
    <md-card class="md-table-card">
      <md-toolbar md-theme="white" class="md-dense">
        <h3 class="md-title">文件浏览</h3>
      </md-toolbar>
      <md-card-area>
        <md-tabs md-right :md-dynamic-height="false" class="md-transparent files-tabs">
          <md-tab  md-label="个人" md-active>
            哈哈
          </md-tab>

          <md-tab md-label="共享">
            呼呼
          </md-tab>
        </md-tabs>
      </md-card-area>
    </md-card>
  </page-content>
</template>

<script lang="ts">
  export default {};
</script>

<style lang="scss" scoped>
  .md-title {
    position: relative;
    z-index: 3;
  }
  .files-tabs {
    margin-top: -48px;
  }
</style>
