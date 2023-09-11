<template>
  <el-card shadow="always" class="app-card">
    <el-button @click="visible = true">click</el-button>
    <dc-dialog :visible.sync="visible" title="sheet" width="80%">
      <luck-sheet />
    </dc-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style></style>
