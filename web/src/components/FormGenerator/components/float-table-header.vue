<template>
  <el-dialog title="表头设置" :visible="visible" @close="close" append-to-body>
    <div class="dynamic-table-wapper"></div>
  </el-dialog>
</template>

<script>
// 浮动表单表头
export default {
  name: "FloatTableHeader",
  props: ["headers"],
  data() {
    return {
      visible: false,
      theaders: [],
    };
  },
  methods: {
    show() {
      this.theaders = JSON.parse(JSON.stringify(this.headers));
      this.visible = true;
    },

    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
