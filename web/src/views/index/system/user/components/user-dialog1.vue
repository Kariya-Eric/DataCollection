<template>
  <div>
    <mdialog :visible.sync="visible" :title="title" @confirm="confirm">
      <mform :form="userForm" :items="userFormItems" ref="userForm" />
    </mdialog>
  </div>
</template>

<script>
export default {
  name: "UserDialog",
  props: ["roles", "depts", "departId"],
  data() {
    return {
      visible: false,
      title: "",
      userForm: {},
      userFormItems: [
        { prop: "account", label: "账号", required: true, type: "input" },
        { prop: "name", label: "姓名", required: true, type: "input" },
        {
          prop: "orgId",
          label: "所属部门",
          required: true,
          type: "select",
          options: this.depts,
        },
        {
          prop: "roleIds",
          label: "角色",
          required: true,
          type: "select",
          multiple: true,
          options: this.roles,
        },
        { prop: "email", label: "邮箱", type: "input" },
        { prop: "mobile", label: "手机", type: "input",rules },
        { prop: "status", label: "状态", type: "switch", number: true },
      ],
    };
  },

  methods: {
    confirm() {},
  },
};
</script>

<style scoped lang="scss"></style>
