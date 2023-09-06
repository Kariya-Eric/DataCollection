<template>
  <el-card shadow="always" class="app-card">
    <mbutton name="open" @click="open" />
    <mdialog :visible.sync="visible" title="xxx" @confirm="confirm">
      <mform :form="form" :items="formItems" ref="form" />
    </mdialog>

    <mtable
      :data="datasource"
      :columns="columns"
      :pagination="ipagination"
      selection="selection"
      @selection-change="changeSelection"
      @sort-change="changeSort"
    >
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="click(row)">click</el-button>
      </template>
    </mtable>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      form: {
        check: [],
      },
      formItems: [
        {
          type: "input",
          label: "活动名称",
          placeholder: "请输入",
          prop: "name",
          required: true,
          rules: [
            {
              validator: function (rule, value, callback) {
                if (value === "x") {
                  callback(new Error("x"));
                }
                callback();
              },
            },
          ],
        },
        {
          type: "select",
          label: "活动区域",
          placeholder: "请选择",
          prop: "area",
          options: [
            { id: 1, name: "安徽" },
            { id: 2, name: "北京" },
            { id: 3, name: "上海" },
          ],
        },
        {
          type: "select",
          multiple: true,
          prop: "area2",
          label: "活动区域2",
          placeholder: "请选择",
          options: [
            { id: 1, name: "安徽" },
            { id: 2, name: "北京" },
            { id: 3, name: "上海" },
          ],
        },
        { type: "switch", label: "即使配送", number: true, prop: "switch" },
        {
          type: "radio",
          label: "特殊资源",
          prop: "radio",
          options: [
            { id: 1, name: "安徽" },
            { id: 2, name: "北京" },
            { id: 3, name: "上海" },
          ],
        },
        {
          type: "checkbox",
          label: "活动性质",
          prop: "check",
          options: [
            { id: 1, name: "安徽" },
            { id: 2, name: "北京" },
            { id: 3, name: "上海" },
            { id: 4, name: "成都" },
          ],
        },
        { type: "year", label: "活动形式", prop: "year" },
        { type: "month", label: "活动形式", prop: "month" },
        { type: "date", label: "活动形式", prop: "date" },
        { type: "textarea", label: "活动形式", prop: "text", disabled: true },
        { type: "number", label: "活动形式", prop: "num", disabled: true },
      ],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
      datasource: [{ id: 1, account: "帐号帐号帐号帐号帐号帐号帐号" }],
      columns: [
        { prop: "id", label: "ID" },
        { prop: "account", label: "帐号", sort: true },
        { slot: "action", label: "操作" },
      ],
    };
  },
  methods: {
    click(row) {
      console.log(row);
    },

    changeSelection(row) {
      console.log(row);
    },

    changeSort({ column, prop, order }) {
      console.log("1", column, prop, order);
    },

    open() {
      this.visible = true;
    },

    async confirm() {
      let flag = await this.$refs.form.submit();
      console.log("f", flag);
    },
  },
};
</script>

<style>
</style>