<template>
  <div>
    <mbutton
      type="primary"
      style="margin-bottom: 12px"
      @click="insertRow"
      name="添加"
    />
    <vxe-table
      border
      ref="xTable"
      align="center"
      size="medium"
      min-height="550"
      :scroll-y="{ enabled: false }"
      :data="dataSource"
      :edit-rules="rules"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column
        v-for="(col, index) in renderColumns"
        :key="col.key"
        :field="col.props"
        :title="col.label"
        :min-width="220"
        :edit-render="col.autofocus"
      >
        <template #header="{ column }">
          <span>{{ column.title }}</span>
          <el-tooltip
            v-if="col.comment.length > 0"
            :content="col.comment"
            effect="dark"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template #edit="scope">
          <template v-if="col.component == 'input'">
            <el-input
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
            />
          </template>
          <template v-if="col.component == 'inputarea'">
            <div style="margin: 8px 0 8px 0">
              <el-input
                type="textarea"
                v-model="scope.row[col.props]"
                :placeholder="col.placeholder"
              />
            </div>
          </template>
          <template v-if="col.component == 'number'">
            <el-input-number
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
              :min="columns[index].type.min"
              :max="columns[index].type.max"
              :precision="columns[index].type.precision"
              controls-position="right"
          /></template>
          <template v-if="col.component == 'link'">
            <form-link
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
            />
          </template>
          <template v-if="col.component == 'mail'">
            <form-mail
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
          /></template>
          <template v-if="col.component == 'phone'">
            <form-phone
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
              :isMobile="columns[index].type.isMobile"
          /></template>
          <template v-if="col.component == 'address'">
            <div style="margin: 8px 0 8px 0">
              <form-address v-model="scope.row[col.props]" /></div
          ></template>
          <template v-if="col.component == 'select'">
            <el-select
              v-model="scope.row[col.props]"
              :filterable="columns[index].type.filterable"
              :multiple="columns[index].type.multiple"
            >
              <el-option
                v-for="(item, i) in columns[index].type.__slot__.options"
                :key="i"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template v-if="col.component == 'date'">
            <el-date-picker
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
              :format="columns[index].type.format"
              :value-format="columns[index].type['value-format']"
              :type="columns[index].type.type"
            />
          </template>
        </template>
        <template
          #default="{ row }"
          v-if="col.component == 'select' || col.component == 'number'"
          >{{
            getLabel(col.component, row[col.props], columns[index].type)
          }}</template
        >
      </vxe-column>
      <vxe-column title="操作" width="100" show-overflow>
        <template #default="{ row }">
          <el-popconfirm title="确认删除该行吗？" @confirm="deleteRow(row)">
            <a href="javascript:;" slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script>
// 用于渲染的vxe表格
export default {
  name: "FormTable",
  props: ["columns", "value", "required"],
  data() {
    return {
      dataSource: this.value,
    };
  },

  computed: {
    rules() {
      let rule = {};
      this.columns.map((column) => {
        let ruleList = [];
        if (column.type.__config__.required) {
          ruleList.push({
            required: true,
            message: `${column.label}为必输项！`,
          });
        }
        if (
          column.type.__config__.label == "单行文本" ||
          column.type.__config__.label == "多行文本"
        ) {
          if (column.type.allowChar) {
            ruleList.push({
              pattern: /^[^\u4E00-\u9FA5]+$/,
              message: `${column.label}中不能包含汉字`,
            });
          }
        } else if (column.type.__config__.label == "链接") {
          ruleList.push({
            pattern: /^[^\u4E00-\u9FA5]+$/,
            message: `${column.label}中不能包含汉字`,
          });
        } else if (column.type.__config__.label == "邮箱") {
          ruleList.push({
            pattern: /\w[-.\w]*@[-a-z0-9]+(\.[-a-z0-9]+)*\.(com|cn)/,
            message: "请输入正确的邮箱",
          });
        } else if (column.type.__config__.label == "电话") {
          if (column.type.isMobile) {
            ruleList.push({
              pattern: /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/,
              message: "请输入正确的电话号码",
            });
          } else {
            ruleList.push({
              pattern: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/,
              message: "请输入正确的手机号",
            });
          }
        }
        if (ruleList.length != 0) {
          rule[column.props] = ruleList;
        }
      });
      return rule;
    },
    renderColumns() {
      return this.columns.map((column) => {
        let component;
        let autofocus;
        if (column.type.__config__.label == "单行文本") {
          component = "input";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "多行文本") {
          component = "inputarea";
          autofocus = { autofocus: ".el-textarea__inner" };
        } else if (column.type.__config__.label == "数字") {
          component = "number";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "链接") {
          component = "link";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "邮箱") {
          component = "mail";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "电话") {
          component = "phone";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "地址") {
          component = "address";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "下拉选择") {
          component = "select";
          autofocus = { autofocus: ".el-input__inner" };
        } else if (column.type.__config__.label == "日期选择") {
          component = "date";
          autofocus = { autofocus: ".el-input__inner" };
        } else {
          component = "";
          autofocus = {};
        }
        let { key, label, props } = column;
        let placeholder = column.type.placeholder;
        let comment = column.type.comment;
        return {
          key,
          label,
          props,
          component,
          autofocus,
          comment,
          placeholder,
        };
      });
    },
  },
  methods: {
    async validate() {
      const $table = this.$refs.xTable;
      const errMap = await $table.validate().catch((errMap) => errMap);
      if (errMap) {
        return "请确认数据是否正确";
      }
      this.$emit("input", $table.getTableData().tableData);
      return undefined;
    },

    async deleteRow(row) {
      const $table = this.$refs.xTable;
      await $table.remove(row);
      this.$emit("input", $table.getTableData().tableData);
    },

    async insertRow() {
      const $table = this.$refs.xTable;
      const errMap = await $table.validate().catch((errMap) => errMap);
      if (errMap) {
        return;
      }
      const newRecord = {};
      const { row: newRow } = await $table.insertAt(newRecord, -1);
      await $table.setActiveRow(newRow);
    },

    // 处理选择和数字的回显
    getLabel(
      component,
      value,
      type,
      valueProp = "value",
      labelField = "label"
    ) {
      if (component == "select") {
        if (type.multiple) {
          if (!value) {
            return null;
          }
          return value
            .map((val) => {
              const item = type.__slot__.options.find(
                (item) => item[valueProp] === val
              );
              return item ? item[labelField] : null;
            })
            .join(", ");
        } else {
          const item = type.__slot__.options.find(
            (item) => item[valueProp] === value
          );
          return item ? item[labelField] : null;
        }
      } else {
        if (value == null) {
          return null;
        }
        let nums = value.toString().split(".");
        if (nums.length == 1) {
          let ret = value + ".";
          for (let i = 0; i < type.precision; i++) {
            ret += "0";
          }
          if (ret.endsWith(".")) {
            return ret.substring(0, ret.length - 1);
          }
          return ret;
        }
        let append = type.precision - nums[1].length;
        for (let i = 0; i < append; i++) {
          value += "0";
        }
        return value;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
