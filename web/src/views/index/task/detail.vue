<template>
  <div>
    <span class="cardTitle">任务名称：&nbsp;&nbsp;{{ taskName }}</span>
    <el-card shadow="always" style="margin-top: 16px">
      <el-form
        label-width="70px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="任务名称">
          <el-select
            v-model="queryParam.name"
            placeholder="请选择"
            @change="searchQuery"
          >
            <el-option label="2022年状态数据填报" value="2022年状态数据填报" />
          </el-select>
        </el-form-item>
        <el-form-item label="表单大类">
          <el-select
            v-model="queryParam.type"
            placeholder="请选择"
            @change="searchQuery"
          >
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParam.type"
            placeholder="请选择"
            @change="searchQuery"
          >
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="表单名称">
          <el-input
            v-model="queryParam.formName"
            placeholder="请输入表单名称"
            @input="searchQuery"
          />
        </el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button type="primary" size="small" icon="el-icon-refresh-right"
          >重置</el-button
        >
      </el-form>

      <div class="listHeader">
        <el-button-group class="buttonGroup">
          <mbutton
            :class="{ active: activeName == 'ALL' }"
            name="全部"
            @click="() => (activeName = 'ALL')"
          />
          <mbutton
            :class="{ active: activeName == 'FILL' }"
            name="我填报的"
            @click="() => (activeName = 'FILL')"
          />
          <mbutton
            :class="{ active: activeName == 'APPROVE' }"
            name="我审核的"
            @click="() => (activeName = 'APPROVE')"
          />
        </el-button-group>
        <div class="listHeaderButton">
          <mbutton type="primary" icon="催办" name="一键催办" />
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="taskFormDataSource"
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
        </el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
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
            <menu-link
              @click="showForm(scope.row)"
              v-if="judgeShow(scope.row, currentUser)"
              >查看</menu-link
            >
            <el-popconfirm
              v-if="judgeRedo(scope.row, currentUser)"
              @confirm="redoForm(scope.row)"
              title="确认要撤回该表吗"
            >
              <menu-link slot="reference">撤回</menu-link>
            </el-popconfirm>
            <menu-link
              @click="pushNotice(scope.row)"
              v-if="judgeRemind(scope.row, currentUser)"
              >催办</menu-link
            >
            <menu-link
              @click="showProgress(scope.row)"
              v-if="judgeProgress(scope.row, currentUser)"
              >填报进度</menu-link
            >
            <menu-link
              @click="handleConfig(scope.row)"
              no-divider
              v-has="'taskDetail_config'"
              v-if="scope.row.status == -1"
              >配置人员</menu-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <config-user-dialog ref="configUserDialog" @refresh="getTaskDetail" />
    <form-drawer ref="formDrawer" />
    <progress-drawer ref="progressDrawer" />
  </div>
</template>

<script>
import {
  getTaskFormDetail,
  taskFormDetail,
  approveForm,
  recallForm,
} from "@/api/task";
import {
  judgeApply,
  judgeAudit,
  judgeShow,
  judgeRedo,
  judgeRemind,
  judgeProgress,
} from "./utils/auth";
import { pushNotice } from "@/api/notice";
import FormDrawer from "./components/form-drawer";
import ProgressDrawer from "./components/progress-drawer";
import ConfigUserDialog from "./components/config-user-dialog";
import { USER_INFO } from "@/store/mutation-types";
export default {
  name: "TaskDetail",
  components: { FormDrawer, ConfigUserDialog, ProgressDrawer },
  data() {
    return {
      judgeApply,
      judgeAudit,
      judgeShow,
      judgeRedo,
      judgeRemind,
      judgeProgress,
      currentUser: this.$ls.get(USER_INFO),
      taskName: "",
      activeName: "ALL",
      taskId: "",
      queryParam: {},
      taskFormDataSource: [],
      loading: false,
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
    };
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "taskDetail") {
          this.taskId = newRoute.query.taskId;
          this.taskName = newRoute.query.taskName;
          this.getTaskDetail();
        }
      },
      immediate: true,
    },

    activeName() {
      this.getTaskDetail();
    },
  },

  methods: {
    searchQuery() {},

    getTaskDetail() {
      let params = { taskId: this.taskId, type: this.activeName };
      this.loading = true;
      getTaskFormDetail(params)
        .then((res) => {
          if (res.state) {
            this.taskFormDataSource = this.handlerData(res.value);
          }
        })
        .finally(() => (this.loading = false));
    },

    showForm(row) {
      taskFormDetail(row.id).then((res) => {
        if (res.state) {
          if (res.value.formProperties && res.value.componentProperties) {
            const formProperties = JSON.parse(res.value.formProperties);
            const componentProperties = JSON.parse(
              res.value.componentProperties
            );
            let formData = { ...formProperties, fields: componentProperties };
            this.$refs.formDrawer.show(
              formData,
              res.value.formName,
              res.value.id
            );
          } else {
            this.$message.error("未根据id查询到表单");
          }
        }
      });
    },

    handlerData(datasource) {
      return datasource.map((ele) => {
        if (ele.children.length == 0) {
          ele.name = ele.formName;
          ele.type = "-";
        } else {
          ele.name = ele.formName;
          ele.type = "总表";
          ele.children.forEach((child) => {
            child.responsibleOrgName = "";
            child.type = "子表";
            child.collaborateOrgName = child.orgName;
          });
        }
        return ele;
      });
    },

    handleConfig(row) {
      this.$refs.configUserDialog.show(row, this.taskId);
    },

    authForm(row) {
      this.loading = true;
      let param = { id: row.id, status: 2 };
      approveForm(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    authFormBack(row) {
      this.loading = true;
      let param = { id: row.id, status: 3 };
      approveForm(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    redoForm(row) {
      this.loading = true;
      recallForm(row.id)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    showProgress(row) {
      this.$refs.progressDrawer.show(row);
    },

    pushNotice(row) {
      let userId = this.currentUser.userId;
      let param = {
        messageType: "PC",
        content: `您有一个数据采集任务 “${row.formName}” 待完成`,
        userId,
        targetLink: `/task/detail?taskId=${this.taskId}`,
      };
      this.loading = true;
      pushNotice(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
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
  },
};
</script>

<style scoped lang="scss">
.buttonGroup {
  .el-button {
    min-width: 92px;
    border: 1px solid #d9d9d9;
  }
}
.active {
  color: #ffffff;
  background: linear-gradient(180deg, #76a8f4 0%, #2f68bd 100%);
}
/deep/.el-table .child-row {
  background: #f2f7ff;
}
</style>
