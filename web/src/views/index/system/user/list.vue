<template>
  <div>
    <el-card shadow="always" class="app-card">
      <msearch
        :form="queryParam"
        label-width="50px"
        :items="searchItems"
        okBtn="查询"
        cancelBtn="重置"
        @submit="searchQuery"
        @cancel="searchReset"
      />

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

      <mtable
        v-loading="loading"
        @selection-change="onSelectChange"
        :data="dataSource"
        :columns="columns"
        :pagination="ipagination"
        selection="selection"
      >
        <template slot="status" slot-scope="{ row }">
          <status status="3" title="启用" v-if="row.status == 1" />
          <status status="2" title="禁用" v-else />
        </template>
        <template slot="action" slot-scope="scope">
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
      </mtable>
    </el-card>
    <user-dialog ref="userDialog" :roles="roleList" :depts="departList" />
  </div>
</template>

<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import { USER_INFO } from "@/store/mutation-types";
import { initDeptTree } from "@/api/system/depart";
import { getRoleList } from "@/api/system/role";
import { downloadTemp } from "@/api/common";
import UserDialog from "./components/user-dialog1.vue";
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
      searchItems: [
        { label: "部门", prop: "orgId", type: "select", options: [] },
        { label: "角色", prop: "roleId", type: "select", options: [] },
        { label: "专业", prop: "major", type: "select", options: [] },
        {
          prop: "queryWord",
          type: "input",
          placeholder: "请输入姓名,帐号,手机",
        },
      ],
      columns: [
        { prop: "account", label: "账号" },
        { prop: "name", label: "姓名" },
        { prop: "orgName", label: "所属部门" },
        { prop: "account", label: "所属专业" },
        { prop: "roleName", label: "角色" },
        { prop: "email", label: "邮箱" },
        { prop: "mobile", label: "手机号" },
        { slot: "status", label: "状态" },
        { slot: "action", label: "操作", width: 260 },
      ],
    };
  },

  created() {
    this.initDepart();
    this.initRole();
    this.loadData(1);
  },

  methods: {
    handleAdd() {
      this.$refs.userDialog.show();
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
          this.searchItems[1].options = this.roleList;
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

<style scoped lang="scss"></style>
