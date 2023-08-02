<template>
  <el-dialog title="表头设置" :visible="visible" @close="close" append-to-body>
    <el-button type="primary" @click="addRow">增加行</el-button>
    <div class="tableDiv">
      <table class="table">
        <tbody class="table-body">
          <tr
            v-for="(header, index) in theaders"
            :key="index"
            class="table-list"
          >
            <td v-for="(item, i) in header" :key="i">
              <div class="tdiv">
                <div class="rightIcon">
                  <i class="el-icon-right"></i>
                </div>
                <el-input v-model="header[i]" size="small" />
                <div class="bottomIcon">
                  <i class="el-icon-bottom"></i>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

    addRow() {
      let row = this.theaders[this.theaders.length - 1];
      this.theaders = [row, ...this.theaders];
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  border-collapse: collapse;
  width: 100%;
  .table-body {
    .table-list {
      height: 46px;
      line-height: 46px;
      td {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        min-width: 220px;
      }
    }
  }
}

.tableDiv {
  margin-top: 12px;
  // overflow-x: auto;
  // overflow-y: auto;
}
.tdiv {
  padding: 6px 6px 6px 0px;
  position: relative;
}
.rightIcon {
  position: absolute;
  right: -10px;
  top: -10px;
}
.bottomIcon {
  position: absolute;
  right: -10px;
  bottom: -10px;
}
</style>