<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="always" class="app-card">
          <div slot="header" class="cardTitleSlot">
            <span>组织架构</span>
            <mbutton
              type="primary"
              name="添加组织"
              class="titleButton"
              @click="addDepart"
            />
          </div>
          <el-form
            label-width="80px"
            size="small"
            :inline="true"
            class="headerForm"
          >
            <el-form-item label="部门名称">
              <el-input
                v-model="departFilter"
                placeholder="请输入部门名称"
                @input="searchDepart"
              />
            </el-form-item>
          </el-form>
          <el-tree
            ref="departTree"
            node-key="id"
            :expand-on-click-node="false"
            :data="departList"
            :props="departProps"
            default-expand-all
            class="filter-tree"
            highlight-current
            @current-change="changeSelect"
            :filter-node-method="filterNode"
            :render-content="renderContent"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <right-depart
          :departId="selectedDepartId"
          :isEdit="departEditFlag"
          @close="closeRight"
          @refresh="initDepart"
        />
      </el-col>
    </el-row>
    <add-depart-dialog
      ref="addDepartDialog"
      @refresh="initDepart"
      :functionId="functionId"
      :teachingId="teachingId"
    />
  </div>
</template>

<script>
import { initDeptTree, delOrg } from "@/api/system/depart";
import { USER_INFO } from "@/store/mutation-types";
import AddDepartDialog from "./components/add-depart-dialog";
import RightDepart from "./components/right-depart.vue";
export default {
  components: { AddDepartDialog, RightDepart },
  data() {
    return {
      departProps: {
        label: "name",
        children: "children",
      },
      departList: [],
      departFilter: "",
      selectedDepartId: "",
      departEditFlag: false,
    };
  },
  mounted() {
    this.initDepart();
  },
  computed: {
    functionId() {
      if (this.departList.length > 0) {
        let functionDept = this.departList[0].children.find(
          (dept) => dept.name == "职能部门"
        );
        if (functionDept) {
          return functionDept.id;
        }
      }
      return "";
    },
    teachingId() {
      if (this.departList.length > 0) {
        let teachingDept = this.departList[0].children.find(
          (dept) => dept.name == "教学部门"
        );
        if (teachingDept) {
          return teachingDept.id;
        }
      }
      return "";
    },
  },
  methods: {
    closeRight() {
      this.$refs.departTree.setCurrentKey(null);
      this.selectedDepartId = "";
    },

    changeSelect(data) {
      if (JSON.parse(data.isParent)) {
        this.selectedDepartId = "";
        return;
      }
      this.departEditFlag = false;
      this.selectedDepartId = data.id;
    },

    initDepart() {
      let userInfo = this.$ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = res.value;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    searchDepart() {
      this.$refs.departTree.filter(this.departFilter);
    },

    renderContent(h, { node, data, store }) {
      return !JSON.parse(data.isParent) ? (
        <span class="custom-tree-node">
          <span class="label">
            <svg-icon width="16px" height="16px" icon-class="部门" />
            {data.name}
          </span>
          <span class="button">
            <span
              onClick={(e) => {
                if (this.$refs.departTree.getCurrentKey() == data.id) {
                  e.stopPropagation();
                  this.departEditFlag = true;
                } else {
                  this.$refs.departTree.setCurrentKey(data.id);
                }
              }}
            >
              <svg-icon width="16px" height="16px" icon-class="编辑" />
            </span>

            <el-popconfirm
              title="确认删除吗？"
              onConfirm={() => this.delOrg(data)}
            >
              <svg-icon
                width="16px"
                height="16px"
                icon-class="删除"
                slot="reference"
              />
            </el-popconfirm>
          </span>
        </span>
      ) : (
        <span class="custom-tree-node">
          <span class="label">
            <svg-icon width="16px" height="16px" icon-class="部门" />
            {data.name}
          </span>
        </span>
      );
    },

    addDepart() {
      this.$refs.addDepartDialog.show();
    },

    delOrg(data) {
      let params = "id=" + data.id;
      delOrg(params).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.initDepart();
          this.selectedDepartId = "";
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 12px;
  .label {
    svg {
      margin-right: 12px;
    }
  }
  .button {
    display: none;
    svg {
      margin-right: 20px;
    }
  }
}
.custom-tree-node:hover .button {
  display: block;
}
</style>
