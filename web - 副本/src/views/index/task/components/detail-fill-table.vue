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
      <el-table-column
        label="负责部门"
        prop="responsibleOrgName"
        align="center"
      />
      <el-table-column
        label="审核人"
        prop="responsibleUserName"
        align="center"
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
            v-if="judgeApply(scope.row, currentUser)"
            @click="showForm(scope.row)"
            >填报</menu-link
          >
          <el-popconfirm
            v-if="judgeRedo(scope.row, currentUser)"
            @confirm="redoForm(scope.row)"
            title="确认要撤回该表吗"
          >
            <menu-link slot="reference">撤回</menu-link>
          </el-popconfirm>
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
    <form-drawer ref="formDrawer" @refresh="pageChange" />
  </div>
</template>

<script>
import { taskFormDetail, recallForm } from "@/api/task";
import { judgeShow, judgeApply, judgeRedo } from "../utils/auth";
import FormDrawer from "./form-drawer";
import { USER_INFO } from "@/store/mutation-types";
export default {
  name: "DetailAllTable",
  props: ["dataSource", "loading"],
  components: { FormDrawer },
  data() {
    return {
      judgeApply,
      judgeShow,
      judgeRedo,
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
