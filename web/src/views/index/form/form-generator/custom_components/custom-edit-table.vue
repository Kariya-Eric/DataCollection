<template>
  <div>
    <table class="table">
      <tbody class="table-body">
        <tr>
          <th></th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "CustomEditTable",
  components: { draggable },

  computed: {},
  data() {
    return {
      columnList: [],
    };
  },
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

        &.selected {
          background: #d4e7f5;
        }
      }
    }
  }
}
</style>
