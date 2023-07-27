<template>
  <div>
    <el-form
      ref="baseForm"
      size="small"
      label-width="100px"
      v-loading="loading"
      :model="menuDetail"
      :rules="baseRule"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="menuDetail.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名" prop="alias">
            <el-input v-model="menuDetail.alias" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="URL" prop="menuUrl">
            <el-input v-model="menuDetail.menuUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板URL" prop="templateUrl">
            <el-input v-model="menuDetail.templateUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标">
            <!-- <span>
              <svg-icon :icon-class="menuDetail.menuIcon" />
            </span> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sn">
            <el-input-number v-model="menuDetail.sn" style="width: 40%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="在菜单中显示" prop="enableMenu">
          <el-select style="width: 30%" v-model="menuDetail.enableMenu">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <el-divider />
    <el-row style="margin-bottom: 8px"
      ><span style="margin-left: 12px">功能资源</span
      ><el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        style="margin-left: 24px"
        @click="addSysMethods"
        >添加</el-button
      ></el-row
    >
    <el-form ref="sysMethodForm" :model="menuDetail">
      <el-table :data="menuDetail.sysMethods" :border="true" size="small">
        <el-table-column label="别名" align="center" prop="alias">
          <template slot-scope="scope">
            <template v-if="!scope.row.editFlag">{{ scope.row.alias }}</template>
            <template v-else>
              <el-form-item
                class="innerFormItem"
                :prop="'sysMethods.' + scope.$index + '.alias'"
                :rules="[{ required: true, message: '别名不能为空' }]"
              >
                <el-input v-model="scope.row.alias" size="small" />
              </el-form-item>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="请求方法名" align="center" prop="name">
          <template slot-scope="scope">
            <template v-if="!scope.row.editFlag">{{ scope.row.name }}</template>
            <template v-else>
              <el-form-item
                class="innerFormItem"
                :prop="'sysMethods.' + scope.$index + '.name'"
                :rules="[{ required: true, message: '请求方法名不能为空' }]"
              >
                <el-input
                  v-model="scope.row.name"
                  size="small"
                  :disabled="!scope.row.editFlag"
                />
              </el-form-item>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" align="center" prop="requestUrl">
          <template slot-scope="scope">
            <template v-if="!scope.row.editFlag">{{ scope.row.requestUrl }}</template>
            <template v-else>
              <el-form-item
                class="innerFormItem"
                :prop="'sysMethods.' + scope.$index + '.requestUrl'"
                :rules="[{ required: true, message: '请求地址不能为空' }]"
              >
                <el-input
                  v-model="scope.row.requestUrl"
                  size="small"
                  :disabled="!scope.row.editFlag"
                />
              </el-form-item>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              v-if="scope.row.editFlag"
              @click="saveRow(scope)"
              >保存</a
            >
            <a href="javascript:;" v-else @click="editRow(scope.row)">修改</a>
            <el-divider direction="vertical" />
            <el-popconfirm
              title="确认要删该条功能资源吗?"
              @confirm="delRow(scope.row)"
            >
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { getMenu } from "@/api/system";
import { nanoid } from "nanoid";
export default {
  name: "RightMenu",
  data() {
    return {
      loading: false,
      menuDetail: {
        menuIcon: "",
      },
      baseRule: {
        name: [{ required: true, message: "菜单名称不能为空" }],
        alias: [{ required: true, message: "别名不能为空" }],
        menuUrl: [{ required: true, message: "Url不能为空" }],
        templateUrl: [{ required: true, message: "模板Url不能为空" }],
        sn: [{ required: true, message: "排序不能为空" }],
      },
    };
  },
  methods: {
    show(id) {
      this.loading = true;
      this.$refs.baseForm.resetFields();
      getMenu(id)
        .then((res) => {
          if (res.state) {
            this.menuDetail = res.value;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addSysMethods() {
      let sysMethod = {
        id: nanoid(),
        alias: "",
        name: "",
        requestUrl: "",
        editFlag: true,
      };
      if (!this.menuDetail.hasOwnProperty("sysMethods")) {
        this.menuDetail.sysMethods = [];
      }
      this.menuDetail.sysMethods.push(sysMethod);
    },

    saveRow(scope) {
      let flag = true;
      this.$refs.sysMethodForm.validateField(
        "sysMethods." + scope.$index + ".alias",
        (valid) => {
          if (valid && valid.length) {
            flag = false;
          }
        }
      );
      this.$refs.sysMethodForm.validateField(
        "sysMethods." + scope.$index + ".name",
        (valid) => {
          if (valid && valid.length) {
            flag = false;
          }
        }
      );
      this.$refs.sysMethodForm.validateField(
        "sysMethods." + scope.$index + ".requestUrl",
        (valid) => {
          if (valid && valid.length) {
            flag = false;
          }
        }
      );
      if (flag) {
        scope.row.editFlag = false;
      }
    },
    editRow(row) {
      row.editFlag = true;
    },
    delRow(row) {
      this.menuDetail.sysMethods = this.menuDetail.sysMethods.filter(
        (data) => data.id != row.id
      );
    },

    updateMenuDetail() {
      return new Promise((resolve, reject) => {
        this.$refs.baseForm.validate((valid) => {
          if (valid) {
            this.$refs.sysMethodForm.validate((valid) => {
              if (valid) {
                this.menuDetail.sysMethods.forEach((sysMethod) => {
                  sysMethod.editFlag = false;
                });
                resolve(this.menuDetail);
              }
              resolve(undefined);
            });
          }
          resolve(undefined);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.innerFormItem {
  margin-bottom: 16px;
}
</style>
