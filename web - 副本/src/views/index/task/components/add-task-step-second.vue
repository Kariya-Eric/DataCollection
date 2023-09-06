<template>
  <div class="main-form" style="overflow: hidden">
    <div class="header">
      <el-row>
        <span>表单集合&nbsp;&nbsp;&nbsp;</span
        ><el-select
          v-model="selectFormCollection"
          size="small"
          clearable
          :disabled="task.type == '教学基本状态数据'"
        >
          <el-option
            v-for="item in formCollectionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <mbutton
          type="primary"
          name="批量配置统计截止时间"
          style="float: right"
          @click="applyDeadlineBatch"
        />
      </el-row>
    </div>
    <el-table
      ref="formTable"
      :data="formList"
      class="listTable"
      :header-cell-style="headerStyle"
      v-loading="loading"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单名称" prop="formName" align="center" />
      <el-table-column label="是否可填报" align="center" width="120">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isCanFill" type="success"
            >可填报</el-tag
          >
          <el-tag size="small" v-else type="warning">不可填报</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <ellipsis v-if="scope.row.remark" :value="scope.row.remark" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="统计截止日期"
        prop="statisticsEndTime"
        align="center"
        width="150"
        sortable
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <menu-link @click="applyDeadline(scope.row)"
            >配置统计截止时间</menu-link
          >
          <menu-link
            no-divider
            @click="applyCanfill(scope.row)"
            v-if="judgeCanfill(scope.row)"
            >申请不可填报</menu-link
          >
          <el-popconfirm
            v-if="judgeRedo(scope.row)"
            @confirm="redoCanfill(scope.row)"
            title="确定撤销不可填报吗？"
            icon="el-icon-info"
            icon-color="red"
          >
            <menu-link slot="reference" no-divider>撤销不可填报</menu-link>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <mbutton
        name="上一步"
        type="primary"
        @click="frontStep"
        style="margin-right: 16px"
        :loading="loading"
      />
      <el-popover placement="bottom" v-model="confirmVisible" trigger="manual">
        <p>所有表单的截止时间相同，是否确认？</p>
        <div style="text-align: right; margin: 0">
          <mbutton name="确定" type="primary" @click="nextStep" />
          <mbutton name="取消" @click="confirmVisible = !confirmVisible" />
        </div>
        <mbutton
          name="下一步"
          type="primary"
          @click="showConfirm"
          slot="reference"
          :loading="loading"
        />
      </el-popover>
      <mbutton @click="back" name="返回" style="margin-left: 16px" />
    </div>
    <unfill-dialog
      ref="unfillDialog"
      @refresh="refreshUnfill"
      :taskId="taskInfo.id"
    />
    <count-deadline-dialog
      ref="countDeadlineDialog"
      :taskId="taskInfo.id"
      :endTime="taskInfo.statisticsEndTime"
      @close="closeDeadLine"
      @refresh="refreshDeadLine"
    />
  </div>
</template>

<script>
import CountDeadlineDialog from "./count-deadline-dialog";
import UnfillDialog from "./unfill-dialog";
import { formCollectionList } from "@/api/form";
import { updateTask, getTaskFormList, configFillStatus } from "@/api/task";
export default {
  components: { UnfillDialog, CountDeadlineDialog },
  props: ["task"],
  name: "AddTaskStepSecond",
  data() {
    return {
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
      selectedRowKeys: [],
      selectFormCollection: "",
      formCollectionList: [],
      formList: [],
      loading: false,
      taskInfo: this.task,
      confirmVisible: false,
    };
  },

  mounted() {
    this.initData();
  },

  watch: {
    selectFormCollection(newVal) {
      if (newVal == "" || !newVal) {
        this.formList = [];
      } else {
        this.loading = true;
        let query = {
          taskId: this.taskInfo.id,
          formCollectionId: newVal,
        };
        getTaskFormList(query)
          .then((res) => {
            if (res.state) {
              this.formList = res.value.map((val) => {
                if (!val.statisticsEndTime) {
                  val.statisticsEndTime = this.taskInfo.statisticsEndTime;
                }
                return val;
              });
            }
          })
          .finally(() => (this.loading = false));
      }
    },
  },

  methods: {
    initData() {
      if (this.task.type == "教学基本状态数据") {
        formCollectionList({ year: this.task.year }).then((res) => {
          if (res.state) {
            this.formCollectionList = res.value.rows;
            this.selectFormCollection = res.value.rows[0].id;
          }
        });
      } else {
        formCollectionList({}).then((res) => {
          if (res.state) {
            this.formCollectionList = res.value.rows.filter(
              (item) => item.enabledFlag == 1
            );
            this.selectFormCollection = this.taskInfo.formCollectionId;
          }
        });
      }
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },

    applyCanfill(row) {
      this.$refs.unfillDialog.edit(row);
    },

    judgeCanfill(row) {
      return row.isCanFill && !row.formRequired;
    },

    judgeRedo(row) {
      return !row.isCanFill && !row.formRequired;
    },

    refreshUnfill(unfillForm) {
      let form = this.formList.find((form) => form.formId == unfillForm.formId);
      form.isCanFill = false;
      form.remark = unfillForm.remark;
    },

    applyDeadlineBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning("请至少选择一行");
        return;
      } else {
        this.$refs.countDeadlineDialog.edit([...this.selectedRowKeys]);
      }
    },
    applyDeadline(row) {
      this.$refs.countDeadlineDialog.edit([row]);
    },

    closeDeadLine() {
      this.$refs.formTable.clearSelection();
    },

    showConfirm() {
      if (this.selectFormCollection == "" || !this.selectFormCollection) {
        this.$message.error("请选择表单合集！");
        return;
      }
      if (this.formList.length > 1) {
        let endTime = this.formList[0].statisticsEndTime;
        if (this.formList.every((e) => e.statisticsEndTime == endTime)) {
          this.confirmVisible = true;
          return;
        }
      }
      this.nextStep();
    },

    refreshDeadLine(deadlineForm) {
      this.formList.forEach((form) => {
        deadlineForm.formIds.forEach((formId) => {
          if (form.formId == formId) {
            form.statisticsEndTime = deadlineForm.statisticsEndTime;
          }
        });
      });
    },

    frontStep() {
      this.$emit("change", 0);
    },

    nextStep() {
      let params = {
        ...this.taskInfo,
        formCollectionId: this.selectFormCollection,
      };
      this.loading = true;
      updateTask(params)
        .then((res) => {
          if (res.state) {
            this.$emit("change", 2);
          }
        })
        .finally(() => (this.loading = false));
    },

    getFormCollectionList() {
      formCollectionList({}).then((res) => {
        if (res.state) {
          this.formCollectionList = res.value.rows;
        }
      });
    },

    back() {
      this.$emit("back");
    },

    redoCanfill(row) {
      const { taskId, formId, isCanFill } = row;
      configFillStatus({
        taskId,
        formId,
        isCanFill: !isCanFill,
        remark: "",
      }).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          row.isCanFill = !row.isCanFill;
          row.remark = "";
        } else {
          this.$message.error(res.message);
        }
      });
    },
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
