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
          v-if="selectedRowKeys.length > 0"
          @click="applyDeadline(true)"
          >批量配置统计截止时间</el-button
        >
      </el-row>
    </div>
    <el-table
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
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a href="javascript:;" @click="applyDeadline(false, scope.row)"
            >配置统计截止时间</a
          >
          <el-divider direction="vertical" />
          <a href="javascript:;" v-if="scope.row.isCanFill" @click="apply"
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
      <el-button type="primary" size="small" @click="frontStep"
        >上一步</el-button
      >
      <el-button type="primary" @click="nextStep" size="small"
        >下一步</el-button
      >
      <el-button @click="back" size="small">返回</el-button>
    </div>
    <unfill-dialog ref="unfillDialog" />
    <count-deadline-dialog
      ref="countDeadlineDialog"
      :taskId="taskId"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import CountDeadlineDialog from "./count-deadline-dialog";
import UnfillDialog from "./unfill-dialog";
import { formCollectionList } from "@/api/form";
import { getTask, updateTask, getTaskFormList } from "@/api/task";
export default {
  components: { UnfillDialog, CountDeadlineDialog },
  props: ["taskId"],
  name: "AddTaskStepSecond",
  data() {
    return {
      selectedRowKeys: [],
      selectFormCollection: "",
      formCollectionList: [],
      formList: [],
      loading: false,
      taskInfo: {},
    };
  },

  mounted() {
    this.getFormCollectionList();
  },

  watch: {
    taskId: {
      handler(newVal) {
        if (newVal !== undefined) {
          this.loading = true;
          getTask(newVal)
            .then((res) => {
              if (res.state) {
                this.taskInfo = res.value;
                this.selectFormCollection = res.value.formCollectionId;
              }
            })
            .finally(() => (this.loading = false));
        }
      },
      immediate: true,
    },

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
              this.formList = res.value;
            }
          })
          .finally(() => (this.loading = false));
      }
    },
  },
  methods: {
    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },
    apply() {
      this.$refs.unfillDialog.show();
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
            this.$message.success(res.message);
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

    applyDeadline(isBatch, row) {
      if (isBatch) {
        this.$refs.countDeadlineDialog.show(
          isBatch,
          this.selectedRowKeys,
          this.formList
        );
      } else {
        let formList = [];
        formList.push(row);
        this.$refs.countDeadlineDialog.show(isBatch, formList, this.formList);
      }
    },

    frontStep() {
      this.$emit("change", 0);
    },

    nextStep() {
      if (this.selectFormCollection == "" || !this.selectFormCollection) {
        this.$message.warning("请选择表单合集！");
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

    back() {
      this.$emit("back");
    },

    redoCanfill(row) {},
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
