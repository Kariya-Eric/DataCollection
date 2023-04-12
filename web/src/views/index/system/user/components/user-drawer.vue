<template>
  <el-drawer
    :title="addFlag ? '新增用户' : '修改用户'"
    :visible="visible"
    @close="close"
  >
    <el-form ref="userForm" :model="userForm">
      <el-form-item props="account" label="帐号">
        <el-input v-model="userForm.account" placeholder="请输入帐号" />
      </el-form-item>
      <el-form-item props="name" label="姓名">
        <el-input v-model="userForm.name" placeholder="请输入姓名" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: "UserDrawer",
  data() {
    return {
      addFlag: false,
      updateFlag: false,
      visible: false,
      userForm: {},
    };
  },
  methods: {
    show(addFlag, updateFlag) {
      this.visible = true;
      if (addFlag) {
        this.addFlag = addFlag;
      } else {
        this.updateFlag = updateFlag;
      }
    },

    close() {
      this.visible = false;
    },
  },
};
</script>

<style>
</style>