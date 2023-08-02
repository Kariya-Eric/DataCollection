<template>
  <div>
    <Mbutton
      type="primary"
      icon="el-icon-plus"
      style="margin-left: 12px"
      @click="insertRow"
      name="添加"
    />
    <vxe-table
      border
      ref="xTable"
      align="center"
      size="medium"
      resizable
      keep-source
      show-overflow
      :edit-rules="rules"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column
        v-for="(col, index) in renderColumns"
        :key="col.key"
        :field="col.props"
        :title="col.label"
        :edit-render="{}"
      >
        <template #edit="scope">
          <template v-if="col.component == 'input'">
            <el-input
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
            />
          </template>
          <template v-if="col.component == 'inputarea'">
            <el-input
              type="textarea"
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
            />
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
            <form-address v-model="scope.row[col.props]"
          /></template>
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
        <template #default="{ row }" v-if="col.component == 'select'">
          {{ getSelectLabel(row[col.props], columns[index].type) }}
        </template>
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
import formAddress from "./form-address.vue";
// 用于渲染的vxe表格
export default {
  components: { formAddress },
  name: "FormTable",
  props: ["columns", "value", "required"],

  computed: {
    rules() {
      return {};
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
          autofocus = { autofocus: ".el-input__inner" };
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
    deleteRow(row) {},

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

    // 处理选择的回显
    getSelectLabel(value, type, valueProp = "value", labelField = "label") {
      if (type.multiple) {
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
    },
  },
};
</script>

<style lang="sass" scoped></style>
