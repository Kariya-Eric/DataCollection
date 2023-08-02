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
select{
  background:#FAF0DE !important;
}
.isedit{
  background-color:#f2faf3 !important;
}
.dynamic-table-wapper{
  // padding:20px;
  // min-height: 200px;
  border-radius: 5px;
  overflow: hidden;
  // border:1px solid #dfe6ec;
  table-layout:fixed;
  .isPreview{
    user-select: auto !important;
  }
  .noPreview{
    user-select: none !important;
  }
  .dynamic-table{
    width:100%;
    border-collapse: collapse;
    &:first-child tr{
      th{
        border-top:none !important;
      }
    }
    tr{
      &:first-child th{
        border-top:none !important;
        border-left:none !important;
      }
      th:first-child,td:first-child{
        border-left:none !important;
      }
      th:last-child,td:last-child{
        border-right:none !important;
      }
      &:last-child td{
        border-bottom:none !important;
      }
    }
    th{
      // background-color: #F9FAFB;
      font-weight: 300;
    }
    td{
      font-size:14px;
      color:#222222;
      // background-color: #ffffff;
    }
    td,th{
      word-wrap:break-word;
      border-spacing: 0;
      // border:1px solid #dfe6ec;
      box-sizing:border-box;
      padding:5px;
      overflow-x: auto;
    }
  }
}
.brder-right-none{
    border-right:none !important;
}
.brder-bottom-none{
    border-bottom:none !important;
}
.table-title{
  text-align:center;
  padding:10px 0;
  font-size:16px;
  font-weight:600;
}
</style
</style>
