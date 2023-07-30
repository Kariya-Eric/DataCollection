<template>
  <el-dialog :visible="visible" @close="close" title="添加组织人员">
    <div class="container">
      <el-form
        label-width="50px"
        size="small"
        :inline="true"
        label-position="left"
        style="margin-bottom: 12px"
      >
        <el-form-item>
          <el-input
            v-model="queryParam.queryWord"
            placeholder="请输入姓名,帐号,手机"
          />
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="initUserList"
          >搜索</el-button
        >
      </el-form>

      <el-table
        v-loading="loading"
        :data="dataSource"
        size="small"
        :border="true"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="帐号" prop="account" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="手机号" prop="mobile" align="center" />
        <el-table-column label="所属部门" prop="orgName" align="center" />
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "启用" : "禁用" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :pagination="ipagination" @change="initUserList" />
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getUserList, addOrgUser } from "@/api/system";
export default {
  name: "AddDepartUserDialog",
  data() {
    return {
      visible: false,
      queryParam: {},
      loading: false,
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
      selectedRowKeys: [],
      orgCode: "",
    };
  },

  methods: {
    show(orgCode) {
      this.orgCode = orgCode;
      this.initUserList();
      this.visible = true;
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    close() {
      this.visible = false;
      this.selectedRowKeys = [];
    },

    initUserList() {
      let pageBean = {
        page: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true,
      };
      let param = { params: Object.assign(this.queryParam), pageBean };
      this.loading = true;
      getUserList(param)
        .then((res) => {
          if (res.state) {
            this.dataSource = res.value.rows;
            this.ipagination.total = res.value.total;
          }
        })
        .finally(() => {
          //清空选择框
          this.loading = false;
        });
    },

    handleSubmit() {
      let queue = this.selectedRowKeys.map((key) => {
        new Promise((resovle) =>
          addOrgUser({ orgCode: this.orgCode, account: key.account }).then(
            (res) => {
              resovle(res);
            }
          )
        );
      });
      Promise.all(queue).then((res) => {
        this.$emit("refresh");
        this.close;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 12px 0 12px;
}
</style>
