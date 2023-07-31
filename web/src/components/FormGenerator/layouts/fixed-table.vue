<template>
  <div class="tableDiv">
    <table class="table">
      <tbody class="table-body">
        <tr class="table-list">
          <th>1</th>
          <th>1</th>
          <th>1</th>
        </tr>
        <tr class="table-list">
          <td>1</td>
          <td>1</td>
          <td>1</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// 浮动表单设计组件
export default {
  name: "FixedTable",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.table {
  border-collapse: collapse;
  width: 100%;
  .table-body {
    cursor: pointer;
    .table-list {
      height: 46px;
      line-height: 46px;
      td {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        min-width: 220px;
        &.selected {
          background: #d4e7f5;
        }
      }
      th {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        min-width: 220px;
        &.selected {
          background: #d4e7f5;
        }
      }
    }
  }
}

.tableDiv {
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
