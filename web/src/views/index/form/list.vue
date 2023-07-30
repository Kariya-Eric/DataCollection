<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="80px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="年份">
          <el-date-picker
            v-model="queryParam.year"
            type="year"
            value-format="yyyy"
            placeholder="请选择年份"
          />
        </el-form-item>
        <el-form-item label="合集类型">
          <el-select
            v-model="queryParam.type"
            placeholder="请选择合集类型"
            clearable
          >
            <el-option label="教学基本状态数据" value="教学基本状态数据" />
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="合集名称">
          <el-input v-model="queryParam.name" placeholder="请输入合集名称" />
        </el-form-item>
        <Mbutton type="primary" name="搜索" @click="searchQuery" />
        <Mbutton type="primary" name="重置" @click="searchReset" />
      </el-form>
      <div class="listHeader">
        <span>合集列表</span>
        <div class="listHeaderButton">
          <Mbutton
            @click="addCollection"
            icon="新建"
            type="primary"
            name="新建合集"
          />
        </div>
      </div>

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
        @sort-change="sortChange"
      >
        <el-table-column label="合集名称" prop="name" align="center" />
        <el-table-column label="合集类型" prop="type" align="center" />
        <el-table-column
          label="年份"
          prop="year"
          align="center"
          sortable="custom"
          width="150"
        />
        <el-table-column label="填报指南" prop="zhinan" align="center" />
        <el-table-column label="合集模板" prop="muban" align="center" />
        <el-table-column label="启用" prop="enabled" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.enabledFlag"
              @change="(val) => enableForm(val, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <menu-link @click="showCollectionDetail(scope.row)"
              >合集详情</menu-link
            >
            <menu-link @click="updateCollection(scope.row)">合集属性</menu-link>
            <el-dropdown
              @command="(command) => handleCommand(command, scope.row)"
              trigger="click"
              :hide-on-click="false"
              placement="bottom"
            >
              <a> 更多<i class="el-icon-arrow-down el-icon--right"></i> </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">上传指南</el-dropdown-item>
                <el-dropdown-item command="b">删除指南</el-dropdown-item>
                <el-dropdown-item command="c">上传模板</el-dropdown-item>
                <el-dropdown-item command="d">删除模板</el-dropdown-item>
                <el-popconfirm
                  @confirm="handleCommand('e', scope.row)"
                  title="合集删除后不可恢复，是否确认删除？"
                >
                  <el-dropdown-item slot="reference" style="color: #e23322"
                    >删除合集</el-dropdown-item
                  >
                </el-popconfirm>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
      <!-- Table End -->
    </el-card>
    <add-collection-dialog ref="addCollectionDialog" @refresh="loadData" />
  </div>
</template>
<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import AddCollectionDialog from "./components/add-collection-dialog";
import { delFormCollection, enableForm } from "@/api/form";
export default {
  name: "FormList",
  mixins: [DataCollectionMixin],
  components: { AddCollectionDialog },
  data() {
    return {
      url: {
        list: "/uc/api/formCollection/list",
      },
    };
  },
  methods: {
    addCollection() {
      this.$refs.addCollectionDialog.show();
    },

    updateCollection(row) {
      this.$refs.addCollectionDialog.show(row);
    },

    delCollection(row) {
      if (row.enabledFlag == 1) {
        this.$message.error("表单启用中,不能删除!");
        return;
      }
      let param = "id=" + row.id;
      this.loading = true;
      delFormCollection(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    showCollectionDetail(row) {
      this.$router.push({
        path: "/form/detail",
        query: { collectionInfo: JSON.stringify(row) },
      });
    },

    enableForm(val, row) {
      this.loading = true;
      enableForm({ id: row.id, enabledFlag: val })
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.value);
          }
        })
        .finally(() => {
          this.loadData();
          this.loading = false;
        });
    },

    sortChange({ column, prop, order }) {
      if (order == "ascending") {
        this.sorter = [{ property: prop, direction: "ASC" }];
      } else if (order == null) {
        this.sorter = [];
      } else {
        this.sorter = [{ property: prop, direction: "DESC" }];
      }
      this.loadData();
    },

    handleCommand(command, row) {
      if (command == "e") {
        this.delCollection(row);
      }
    },
  },
};
</script>

<style></style>
