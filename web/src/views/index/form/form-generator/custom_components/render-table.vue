<template>
  <div>
    <el-button type="text" @click="addRow"
      ><span style="font-size: 10px">添加行</span></el-button
    >
    <el-popconfirm
      title="确认删除选中行吗？"
      @confirm="delBatch"
      v-if="selectedRowKeys.length > 0"
    >
      <el-button type="text" slot="reference"
        ><span style="color: red; font-size: 10px">批量删除</span></el-button
      >
    </el-popconfirm>
    <el-form ref="tableForm" :model="tableForm">
      <el-table
        ref="table"
        size="small"
        :border="true"
        :data="tableForm.dataSource"
        fit
        @selection-change="onSelectChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          fixed="left"
        />
        <el-table-column type="index" width="55" align="center">
          <template slot="header"> # </template>
        </el-table-column>
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          :label="col.label"
          :prop="col.props"
          align="center"
          width="auto"
          min-width="220"
        >
          <template slot="header" slot-scope="scope">
            <template v-if="col.comment !== ''">
              <span slot="label">
                <span>{{ scope.column.label }}</span>
                <el-tooltip
                  style="margin: 2px"
                  effect="dark"
                  :content="col.comment"
                  placement="right"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
            </template>
            <template v-else>
              {{ scope.column.label }}
            </template>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <template v-if="col.type === 'select' && !col.multiple">
                {{
                  col.options.filter(
                    (el) => el.value === scope.row[col.props]
                  )[0].label
                }}
              </template>
              <template v-if="col.type === 'select' && col.multiple">
                {{ showSelectVal(scope.row[col.props], col.options) }}
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
                      ? col.allowChar
                        ? [
                            { required: true, message: `${col.label}不能为空` },
                            charRule,
                          ]
                        : [{ required: true, message: `${col.label}不能为空` }]
                      : col.allowChar
                      ? [charRule]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                >
                  <el-input
                    clearable
                    v-model="scope.row[col.props]"
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
                      ? col.allowChar
                        ? [
                            { required: true, message: `${col.label}不能为空` },
                            charRule,
                          ]
                        : [{ required: true, message: `${col.label}不能为空` }]
                      : col.allowChar
                      ? [charRule]
                      : []
                  "
                  :prop="'dataSource.' + scope.$index + '.' + col.props"
                  class="formItem"
                >
                  <el-input
                    type="textarea"
                    v-model="scope.row[col.props]"
                    clearable
                    :placeholder="`请输入${col.label}`"
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
                      ? col.isMobile
                        ? [
                            { required: true, message: `${col.label}不能为空` },
                            phoneRule,
                          ]
                        : [
                            { required: true, message: `${col.label}不能为空` },
                            mobileRule,
                          ]
                      : col.isMobile
                      ? [phoneRule]
                      : [mobileRule]
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
                    :multiple="col.multiple"
                    :filterable="col.filterable"
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
                    :type="col.dateType"
                    :format="col.format"
                    :value-format="col['value-format']"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <a
              v-if="scope.row.isEdit"
              href="javascript:;"
              @click="edit(scope.row)"
              >编辑</a
            >
            <a v-else href="javascript:;" @click="save(scope)">保存</a>
            <el-divider direction="vertical" />
            <el-popconfirm title="确认删除该行吗？" @confirm="del(scope.row)">
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import customNumber from "./custom-number.vue";
import { nanoid } from "nanoid";
export default {
  components: { customNumber },
  name: "renderTable",
  props: ["columns", "value", "required"],
  watch: {
    value(val) {
      if (val[0] === undefined) {
        this.tableForm.dataSource = [];
      }
    },
  },
  data() {
    return {
      tableForm: {
        dataSource: this.value ? this.value : [],
      },
      selectedRowKeys: [],
      mobileRule: {
        pattern: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/,
        message: "请输入正确的手机号",
      },
      phoneRule: {
        pattern: /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/,
        message: "请输入正确的电话号码",
      },
      charRule: {
        pattern: /^[^\u4E00-\u9FA5]+$/,
        message: "输入内容不能包含汉字",
      },
    };
  },
  methods: {
    addRow() {
      let newVal = {};
      this.columns.forEach((col) => {
        if (col.type === "select" && col.multiple) {
          newVal[col.props] = [];
        } else {
          newVal[col.props] = undefined;
        }
      });
      newVal = { id: nanoid(), ...newVal, isEdit: false };
      this.tableForm.dataSource.push(newVal);
    },

    edit(row) {
      row.isEdit = false;
    },

    save(scope) {
      let rows = Object.keys(scope.row)
        .filter((key) => key !== "isEdit")
        .map((key) => {
          if (typeof scope.row[key] === "object") {
            scope.row[key] = scope.row[key].join(",");
          }
          return `dataSource.${scope.$index}.${key}`;
        });
      let flag = true;
      rows.forEach((row) => {
        this.$refs.tableForm.validateField(row, (valid) => {
          if (valid && valid.length) {
            return (flag = false);
          }
        });
      });

      if (flag) {
        scope.row.isEdit = true;
        this.$emit("input", this.tableForm.dataSource);
      } else {
        this.edit(scope.row);
      }
    },
    del(row) {
      this.tableForm.dataSource = this.tableForm.dataSource.filter(
        (data) => data.id !== row.id
      );
    },
    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys.map((rowkey) => rowkey.id);
    },

    showSelectVal(val, options) {
      let vals = val.split(",");
      let multiSelectValues = [];
      for (let i = 0; i < vals.length; i++) {
        for (let j = 0; j < options.length; j++) {
          if (options[j].value == vals[i]) {
            multiSelectValues.push(options[j].label);
            continue;
          }
        }
      }
      return multiSelectValues.join("，");
    },

    delBatch() {
      this.selectedRowKeys.forEach((id) => {
        this.tableForm.dataSource.some((item, i) => {
          if (item.id === id) {
            this.tableForm.dataSource.splice(i, 1);
          }
        });
      });
      this.$refs.table.clearSelection();
    },

    validateTable() {
      if (this.required && this.tableForm.dataSource.length === 0) {
        return 1;
      }
      let keys = this.columns.map((col) => {
        const { props } = col;
        for (let i = 0; i < this.tableForm.dataSource.length; i++) {
          if (typeof this.tableForm.dataSource[i][props] === "object") {
            this.tableForm.dataSource[i][props] =
              this.tableForm.dataSource[i][props].join(",");
          }
        }
        return props;
      });
      let flag = true;
      for (let i = 0; i < this.tableForm.dataSource.length; i++) {
        let rowFlag = true;
        keys
          .map((key) => `dataSource.${i}.${key}`)
          .forEach((key) => {
            this.$refs.tableForm.validateField(key, (valid) => {
              if (valid && valid.length) {
                rowFlag = false;
                return (flag = false);
              }
            });
          });
        if (rowFlag) {
          this.tableForm.dataSource[i].isEdit = true;
        }
      }
      if (!flag) {
        return 2;
      } else {
        this.$emit("input", this.tableForm.dataSource);
        return 0;
      }
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-form-item {
  margin-bottom: 16px;
}
</style>
