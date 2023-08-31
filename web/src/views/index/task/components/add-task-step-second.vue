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
      size="small"
      :border="true"
      v-loading="loading"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单名称" prop="formName" align="center" />
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isCanFill" type="success"
            >可填报</el-tag
          >
          <el-tag size="small" v-else type="warning">不可填报</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.remark">
            {{ scope.row.remark }}
            <!-- <el-tooltip :content="" placement="right" effect="dark">
            </el-tooltip> -->
          </div>
          <div v-else>-</div>
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
          <a
            href="javascript:;"
            v-if="scope.row.isCanFill"
            @click="apply(scope.row)"
            >申请不可填报</a
          >
          <el-popconfirm
            v-else
            @confirm="redoCanfill(scope.row)"
            title="确定撤销不可填报吗？"
            icon="el-icon-info"
            icon-color="red"
          >
            <a href="javascript:;" slot="reference">撤销不可填报</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <mbutton name="上一步" type="primary" @click="frontStep" />
      <el-popover placement="top" v-model="confirmVisible">
        <p>所有表单的截止时间相同，是否确认？</p>
        <div style="text-align: right; margin: 0">
          <mbutton name="取消" />
        </div>
        <mbutton
          name="下一步"
          type="primary"
          @click="nextStep"
          slot="reference"
        />
      </el-popover>
      <mbutton @click="back" name="返回" />
    </div>
    <unfill-dialog ref="unfillDialog" @refresh="refresh" />
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
          }
        });
      }
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },
    apply(row) {
      this.$refs.unfillDialog.show(row);
    },
    refresh() {
      //TODO 配置完成的回显
      this.selectedRowKeys = [];
      let params = {
        ...this.taskInfo,
        formCollectionId: this.selectFormCollection,
      };
      this.loading = true;
      updateTask(params)
        .then((res) => {
          if (res.state) {
            //this.$message.success(res.message);
            let query = {
              taskId: this.taskInfo.id,
              formCollectionId: this.selectFormCollection,
            };
            getTaskFormList(query).then((res) => {
              if (res.state) {
                this.formList = res.value;
              }
            });
          } else {
            this.$message.warning(res.message);
          }
        })
        .finally(() => (this.loading = false));
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
      if (this.selectFormCollection == "" || !this.selectFormCollection) {
        this.$message.error("请选择表单合集！");
        return;
      }
      if (this.formList.length > 1) {
        let endTime = this.formList[0].statisticsEndTime;
        if (this.formList.every((e) => e.statisticsEndTime == endTime)) {
          this.confirmVisible = false;
          console.log(123);
        } else {
          console.log(456);
        }
        return;
      }
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
      configFillStatus({ taskId, formId, isCanFill: !isCanFill }).then(
        (res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.refresh();
          } else {
            this.$message.error(res.message);
          }
        }
      );
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
