<template>
  <div class="pagination-container">
    <el-pagination
      align="right"
      :layout="layout"
      :background="background"
      :page-sizes="pagination.pageSizeOptions"
      :total="pagination.total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :small="small"
    />
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pagination: {
      required: true,
      type: Object,
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes,jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSizeChange(val) {
      // console.log('emitting...' + val);
      this.pagination.pageSize = val;
      this.$emit("change", this.pagination);
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.$emit("change", this.pagination);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  margin-right: 10px;
  /deep/ .el-pagination__jump {
    margin-left: 0px;
  }
}
</style>
