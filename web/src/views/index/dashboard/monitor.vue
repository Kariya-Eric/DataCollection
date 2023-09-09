<template>
  <el-card shadow="always" class="app-card">
    <el-form>
      <el-form-item label="xx">
        <el-input v-model="input" />
      </el-form-item>
    </el-form>
    <el-button>123</el-button>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      input: '123'
    }
  }
}
</script>

<style></style>
