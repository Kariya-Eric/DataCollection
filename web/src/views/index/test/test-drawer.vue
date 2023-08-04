<template>
  <div>
    <el-drawer
      :visible="visible"
      @close="close"
      size="80%"
      title="预览"
      v-if="visible"
    >
      <form-view :formConf="formConf" @getMsg="getMsg" ref="formView" />
    </el-drawer>
  </div>
</template>

<script>
// 表单预览页面
export default {
  name: "TestDrawer",
  data() {
    return {
      formConf: {},
      visible: false,
    };
  },
  methods: {
    show(formConf) {
      this.formConf = formConf;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },

    getMsg(value) {
      console.log("get", value);
    },
  },
};
</script>

<style scoped lang="scss"></style>
