<template>
  <div>
    <el-table
      v-loading="loading"
      :data="dataSource"
      :row-key="(record) => record.id + record.type"
      default-expand-all
      class="listTable"
      :header-cell-style="headerStyle"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="表单名称" prop="name">
        <template slot-scope="scope">
          <svg-icon
            icon-class="固定表单"
            width="16px"
            height="16px"
            v-if="scope.row.name"
          />
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" width="100" />
      <el-table-column
        label="负责部门"
        prop="responsibleOrgName"
        align="center"
      />
      <el-table-column
        label="填报部门"
        prop="collaborateOrgName"
        align="center"
      />
      <el-table-column
        label="填报人"
        prop="fillUserName"
        align="center"
        width="120"
      />
      <el-table-column
        label="审核人"
        prop="responsibleUserName"
        align="center"
        width="120"
      />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <status
            :status="caculateStatus(scope.row.status).status"
            :title="caculateStatus(scope.row.status).name"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="统计截止时间"
        prop="statisticsEndTime"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <el-statistic
            :value="calculateEndTime(scope.row.statisticsEndTime)"
            format="HH:mm:ss"
            time-indices
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template slot-scope="scope">
          <menu-link
            @click="handleConfig(scope.row)"
            v-has="'taskDetail_config'"
            v-if="scope.row.status == -1"
            >配置人员</menu-link
          >
          <menu-link
            v-if="judgeApply(scope.row, currentUser)"
            @click="showForm(scope.row)"
            >填报</menu-link
          >
          <el-popconfirm
            v-if="judgeAudit(scope.row, currentUser)"
            @confirm="authForm(scope.row)"
            @cancel="authFormBack(scope.row)"
            confirm-button-text="通过"
            cancel-button-text="驳回"
            title="如何操作该表？"
          >
            <menu-link slot="reference">审核</menu-link>
          </el-popconfirm>
          <el-popconfirm
            v-if="judgeRedo(scope.row, currentUser)"
            @confirm="redoForm(scope.row)"
            title="确认要撤回该表吗"
          >
            <menu-link slot="reference">撤回</menu-link>
          </el-popconfirm>
          <menu-link
            @click="showProgress(scope.row)"
            v-if="judgeProgress(scope.row, currentUser)"
            >填报进度</menu-link
          >
          <menu-link
            @click="pushNotice(scope.row)"
            v-if="judgeRemind(scope.row, currentUser)"
            >催办</menu-link
          >
          <menu-link
            no-divider
            v-if="judgeShow(scope.row, currentUser)"
            @click="showForm(scope.row)"
            >查看</menu-link
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="ipagination" @change="pageChange" />
    <config-user-dialog ref="configUserDialog" @refresh="pageChange" />
    <form-drawer ref="formDrawer" @refresh="pageChange" />
    <progress-drawer ref="progressDrawer" />
  </div>
</template>

<script>
import { taskFormDetail, approveForm, recallForm } from "@/api/task";
import { pushNotice } from "@/api/notice";
import {
  judgeShow,
  judgeApply,
  judgeAudit,
  judgeProgress,
  judgeRedo,
  judgeRemind,
} from "../utils/auth";
import ConfigUserDialog from "./config-user-dialog";
import FormDrawer from "./form-drawer";
import ProgressDrawer from "./progress-drawer";
import { USER_INFO } from "@/store/mutation-types";
export default {
  name: "DetailAllTable",
  props: ["dataSource", "loading", "taskId"],
  components: { ConfigUserDialog, FormDrawer, ProgressDrawer },
  data() {
    return {
      judgeApply,
      judgeShow,
      judgeAudit,
      judgeProgress,
      judgeRedo,
      judgeRemind,
      //分页参数
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
      currentUser: this.$ls.get(USER_INFO),
    };
  },

  methods: {
    calculateEndTime(date) {
      return new Date(date).getTime();
    },

    pageChange() {
      this.$emit("refresh");
    },

    caculateStatus(status) {
      if (status == 0) {
        return { status: 2, name: "待提交" };
      } else if (status == 1) {
        return { status: 1, name: "审核中" };
      } else if (status == 2) {
        return { status: 3, name: "审核通过" };
      } else if (status == 3) {
        return { status: 0, name: "退回修改" };
      } else {
        return { status: 2, name: "待配置人员" };
      }
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.type == "子表") {
        return "child-row";
      }
      return "";
    },

    handleConfig(row) {
      this.$refs.configUserDialog.show(row);
    },

    showForm(row) {
      taskFormDetail(row.id).then((res) => {
        if (res.state) {
          if (res.value.formProperties && res.value.componentProperties) {
            const formProperties = JSON.parse(res.value.formProperties);
            const fields = JSON.parse(res.value.componentProperties);
            const data =
              res.value.formData == null
                ? null
                : JSON.parse(res.value.formData);
            let formData = { ...formProperties, fields, data };
            this.$refs.formDrawer.show(
              formData,
              res.value.formName,
              res.value.id,
              res.value.status
            );
          } else {
            this.$message.error("该表单未配置任何组件，请先设计表单！");
          }
        }
      });
    },

    authForm(row) {
      let param = { id: row.id, status: 2 };
      approveForm(param).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.$emit("refresh");
        } else {
          this.$message.error(res.message);
        }
      });
    },

    authFormBack(row) {
      let param = { id: row.id, status: 3 };
      approveForm(param).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.$emit("refresh");
        } else {
          this.$message.error(res.message);
        }
      });
    },

    showProgress(row) {
      this.$refs.progressDrawer.show(row);
    },

    redoForm(row) {
      recallForm(row.id).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.$emit("refresh");
        } else {
          this.$message.error(res.message);
        }
      });
    },

    pushNotice(row) {
      let userId = this.currentUser.userId;
      let param = {
        messageType: "PC",
        content: `您有一个数据采集任务 “${row.formName}” 待完成`,
        userId,
        targetLink: `/task/detail?taskId=${this.taskId}`,
      };
      pushNotice(param).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.$emit("refresh");
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-table .child-row {
  background: #f2f7ff;
}
/deep/ .el-statistic .con .number {
  font-size: 16px;
}
</style>
