<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="50px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="部门">
          <el-select
            v-model="queryParam.orgId"
            filterable
            placeholder="请选择部门"
          >
            <el-option
              v-for="item in departList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="queryParam.roleId"
            filterable
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select
            v-model="queryParam.major"
            filterable
            placeholder="请选择专业"
          >
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParam.queryWord"
            placeholder="请输入姓名,帐号,手机"
          />
        </el-form-item>
        <mbutton type="primary" @click="searchQuery" name="搜索" />
        <mbutton type="primary" @click="searchReset" name="重置" />
      </el-form>

      <div class="listHeader">
        <span>用户管理</span>
        <div class="listHeaderButton">
          <el-popconfirm
            v-if="selectedRowKeys.length > 0"
            @confirm="delBatch"
            title="确认批量删除选中用户吗？"
          >
            <mbutton type="danger" slot="reference" name="批量删除" />
          </el-popconfirm>
          <mbutton
            style="margin-left: 16px"
            @click="handleAdd"
            type="primary"
            name="添加用户"
            icon="新建"
          />
          <mbutton type="primary" name="导入" />
          <mbutton type="primary" name="导出" @click="handleExport" />
          <a class="downHref" @click="downloadTemp">下载导入模板</a>
        </div>
      </div>

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
        :border="true"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" width="70" align="center" />
        <el-table-column label="帐号" prop="account" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="所属部门" prop="orgName" align="center" />
        <el-table-column label="所属专业" align="center" />
        <el-table-column label="角色" prop="roleName" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="手机号" prop="mobile" align="center" />
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <status status="3" title="启用" v-if="scope.row.status == 1" />
            <status status="2" title="禁用" v-else />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <menu-link @click="handleDetail(scope.row)">查看</menu-link>
            <menu-link @click="handleEdit(scope.row)">编辑</menu-link>
            <el-popconfirm
              @confirm="delBatch(scope.row.id)"
              title="确定删除该用户吗？"
            >
              <menu-link slot="reference">删除</menu-link>
            </el-popconfirm>
            <el-popconfirm
              @confirm="resetUser(scope.row)"
              title="确定重置该用户的密码吗？"
            >
              <menu-link slot="reference" no-divider>重置密码</menu-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <user-dialog
      ref="modalForm"
      @refresh="loadData"
      :roles="roleList"
      :depts="departList"
    />
  </div>
</template>

<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import UserDialog from "./components/user-dialog";
import { resetPwd } from "@/api/system/user";
import { USER_INFO } from "@/store/mutation-types";
import { initDeptTree } from "@/api/system/depart";
import { getRoleList } from "@/api/system/role";
import { downloadTemp } from "@/api/common";
export default {
  name: "UserList",
  mixins: [DataCollectionMixin],
  components: { UserDialog },
  data() {
    return {
      roleList: [],
      departList: [],
      url: {
        list: "/uc/api/user/getUserPage",
        delBatch: "/uc/api/user/deleteUserByIds",
        downloadTemp: "/uc/api/user/downloadTemplate",
        uploadUrl: "/uc/api/user/import",
        exportUrl: "/uc/api/user/export",
      },
    };
  },

  created() {
    this.initDepart();
    this.initRole();
    this.loadData(1);
  },

  methods: {
    resetUser(row) {
      resetPwd({ account: row.account, newPwd: "123456" }).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.loadData();
        } else {
          this.$message.error(res.message);
        }
      });
    },

    renderDepart(departList) {
      let options = [];
      let functionalDepart = departList[0].children.find(
        (depart) => depart.name == "职能部门"
      );
      let teachingDepart = departList[0].children.find(
        (depart) => depart.name == "教学部门"
      );
      functionalDepart.children.forEach((dept) => {
        if (dept.status == 1) {
          options.push(dept);
        }
      });
      teachingDepart.children.forEach((dept) => {
        if (dept.status == 1) {
          options.push(dept);
        }
      });
      return options;
    },

    initDepart() {
      let userInfo = this.$ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = this.renderDepart(res.value);
        }
      });
    },

    initRole() {
      getRoleList({}).then((res) => {
        if (res.state) {
          this.roleList = res.value.rows.filter((role) => role.enabled == 1);
        }
      });
    },

    downloadTemp() {
      downloadTemp(this.url.downloadTemp).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败！");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], { type: "application/vnd.ms-excel" }),
            this.moduleName + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], { type: "appliaction/vnd.ms-excel" })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "模板.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.downHref {
  line-height: 32px;
  margin-left: 12px;
  margin-right: 12px;
}
</style>
