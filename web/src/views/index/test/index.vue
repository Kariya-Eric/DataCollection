<template>
  <div>
    <el-card shadow="always" class="app-card">
      <Mbutton name="测试按钮" @click="show" />
    </el-card>
    <test-dialog ref="testDialog" />
  </div>
</template>

<script>
import testDialog from "./test-dialog";
export default {
  components: { testDialog },

  methods: {
    show() {
      this.$refs.testDialog.show();
    },
  },
};
</script>

<style scoped lang="scss"></style>
