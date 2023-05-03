<template>
  <div>
    <div class="search-button-admin">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRow"
        >添加行</el-button
      >
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        v-if="selectedRowKeys.length > 0"
        >批量删除</el-button
      >
      <el-button type="primary" size="small" icon="el-icon-upload2"
        >导入</el-button
      >
    </div>
    <el-form ref="tableForm" :model="tableForm">
      <el-table
        size="small"
        :border="true"
        :data="tableForm.dataSource"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          :label="col.label"
          :prop="col.props"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <template v-if="col.type === 'select'">
                {{
                  col.options.filter(
                    (el) => el.value === scope.row[col.props]
                  )[0].label
                }}
              </template>
              <template v-else>
                {{ scope.row[col.props] }}
              </template>
            </template>
            <template v-else>
              <template v-if="col.type === 'input'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `${col.label}不能为空` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <el-input
                    clearable
                    v-model="scope.row[col.props]"
                    :maxlength="col.maxlength"
                    :show-word-limit="col.maxlength ? true : false"
                    :placeholder="`请输入${col.label}`"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'inputarea'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `${col.label}不能为空` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <el-input
                    type="textarea"
                    v-model="scope.row[col.props]"
                    :autosize="{
                      maxRows: col.maxRows,
                      minRows: col.minRows,
                    }"
                    clearable
                    :maxlength="col.maxlength"
                    :placeholder="`请输入${col.label}`"
                    :show-word-limit="col.maxlength ? true : false"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'inputnumber'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `${col.label}不能为空` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <custom-number
                    :disabled="false"
                    v-model="scope.row[col.props]"
                    :precision="col.precision"
                    :min="col.min"
                    :max="col.max"
                    :placeholder="`请输入${col.label}`"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'mail'">
                <el-form-item
                  :rules="
                    col.required
                      ? [
                          { required: true, message: `${col.label}不能为空` },
                          {
                            type: 'email',
                            message: '请输入正确的邮箱',
                          },
                        ]
                      : [
                          {
                            type: 'email',
                            message: '请输入正确的邮箱',
                          },
                        ]
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <custom-mail
                    :disabled="false"
                    :readonly="false"
                    v-model="scope.row[col.props]"
                    :placeholder="`请输入${col.label}`"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'phone'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `${col.label}不能为空` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <custom-phone
                    :disabled="false"
                    v-model="scope.row[col.props]"
                    :readonly="false"
                    :placeholder="`请输入${col.label}`"
                    size="small"
                    :isMobile="col.isMobile"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'address'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `${col.label}不能为空` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <custom-address
                    :placeholder="`请输入${col.label}`"
                    v-model="scope.row[col.props]"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
              <template v-if="col.type === 'select'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `请选择${col.label}` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <el-select
                    size="small"
                    style="width: 100%"
                    v-model="scope.row[col.props]"
                    :placeholder="`请选择${col.label}`"
                  >
                    <el-option
                      v-for="(item, index) in col.options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="col.type === 'datepick'">
                <el-form-item
                  :rules="
                    col.required
                      ? [{ required: true, message: `请选择${col.label}` }]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <el-date-picker
                    :placeholder="`请输入${col.label}`"
                    v-model="scope.row[col.props]"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a
              v-if="scope.row.isEdit"
              href="javascript:;"
              @click="edit(scope.row)"
              >编辑</a
            >
            <a v-else href="javascript:;" @click="save(scope.row)">保存</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="del(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import customNumber from "./custom-number.vue";
export default {
  components: { customNumber },
  name: "renderTable",
  props: ["columns", "value"],
  data() {
    return {
      tableForm: {
        dataSource: this.value ? this.value : [],
      },
      selectedRowKeys: [],
    };
  },
  methods: {
    addRow() {
      let newVal = {};
      this.columns.forEach((col) => {
        newVal[col.props] = undefined;
      });
      newVal = { ...newVal, isEdit: false };
      this.tableForm.dataSource.push(newVal);
    },
    edit(row) {
      row.isEdit = false;
    },
    save(row) {
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          this.$emit("input", this.tableForm.dataSource);
          row.isEdit = true;
        }
      });
    },
    del(row) {
      this.tableForm.dataSource = this.tableForm.dataSource.filter(
        (data) => data !== row
      );
    },
    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .cell {
  padding-bottom: 0;
}
/deep/ .el-form-item__error {
  padding-top: 0;
}
</style>
