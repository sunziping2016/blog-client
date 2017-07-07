<template>
  <md-table-card class="file-manager">
    <md-toolbar>
      <h1 class="md-title"></h1>
      <md-button class="md-icon-button">
        <md-icon>add</md-icon>
      </md-button>
    </md-toolbar>
    <md-table-alternate-header md-selected-label="选中">
      <md-button class="md-icon-button">
        <md-icon>delete</md-icon>
      </md-button>
    </md-table-alternate-header>
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>文件</md-table-head>
          <md-table-head>类型</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row md-selection>
          <md-table-cell key="file">
            哈哈
          </md-table-cell>
          <md-table-cell key="type">
            文件夹
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </md-table-card>
</template>

<script lang="ts">
export default {
};
</script>

<style lang="scss">
  .file-manager {
    .md-toolbar {
      min-height: 56px;
    }

  }
</style>
