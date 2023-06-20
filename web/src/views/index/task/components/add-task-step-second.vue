<template>
  <div class="main-form" style="overflow: hidden">
    <div class="header">
      <el-row>
        <span>表单集合&nbsp;&nbsp;&nbsp;</span
        ><el-select v-model="selectFormCollection" size="small" clearable>
          <el-option
            v-for="item in formCollectionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          type="primary"
          size="small"
          style="float: right"
          @click="applyDeadline(true)"
          >批量配置统计截止时间</el-button
        >
      </el-row>
    </div>
    <el-table :data="formList" size="small" :border="true" v-loading="loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单名称" prop="name" align="center" />
      <el-table-column label="状态" align="center" />
      <el-table-column label="备注" align="center" />
      <el-table-column label="统计截止日期" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a href="javascript:;" @click="applyDeadline(false, scope.row)"
            >配置统计截止时间</a
          >
          <el-divider direction="vertical" v-if="scope.row.status == 1" />
          <a href="javascript:;" v-if="scope.row.status == 1" @click="apply"
            >申请不可填报</a
          >
          <el-popconfirm
            v-else
            title="确定撤销不可填报吗？"
            icon="el-icon-info"
            icon-color="red"
          >
            <a href="javascript:;">撤销不可填报</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button type="primary" size="small" @click="frontStep"
        >上一步</el-button
      >
      <el-button type="primary" @click="nextStep" size="small"
        >下一步</el-button
      >
    </div>
    <unfill-dialog ref="unfillDialog" />
    <count-deadline-dialog ref="countDeadlineDialog" />
  </div>
</template>

<script>
import CountDeadlineDialog from "./count-deadline-dialog";
import UnfillDialog from "./unfill-dialog";
import { formCollectionList, getFormList } from "@/api/form";
export default {
  components: { UnfillDialog, CountDeadlineDialog },
  name: "AddTaskStepSecond",
  data() {
    return {
      selectFormCollection: "",
      formCollectionList: [],
      formList: [],
      loading: false,
    };
  },

  mounted() {
    this.getFormCollectionList();
  },

  watch: {
    selectFormCollection(newVal) {
      if (newVal === "") {
        this.formList = [];
      } else {
        this.loading = true;
        let query = {
          id: newVal,
          pageBean: { page: 1, pageSize: 1000, showTotal: true },
        };
        getFormList(query)
          .then((res) => {
            if (res.state) {
              this.formList = res.value.rows;
            }
          })
          .finally(() => (this.loading = false));
      }
    },
  },
  methods: {
    apply() {
      this.$refs.unfillDialog.show();
    },

    applyDeadline(isBatch, row) {
      if (isBatch) {
        this.$refs.countDeadlineDialog.show(isBatch, this.formList);
      } else {
        let formList = [];
        formList.push(row);
        this.$refs.countDeadlineDialog.show(isBatch, formList);
      }
    },

    frontStep() {
      this.$emit("change", 0);
    },

    nextStep() {
      this.$emit("change", 2);
    },

    getFormCollectionList() {
      let query = {
        params: {},
        pageBean: { page: 1, pageSize: 1000, showTotal: true },
      };
      formCollectionList(query).then((res) => {
        if (res.state) {
          this.formCollectionList = res.value.rows;
        }
      });
    },

    getFormList() {},
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 24px;
  .headerButton {
    margin-right: 0px;
  }
}
.main-form {
  width: 60%;
  margin: auto;
}

.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>