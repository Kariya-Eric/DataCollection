<template>
  <div>
    <el-drawer :visible="visible" @close="close" size="80%" title="预览">
      <form-view :formConf="formConf" />
    </el-drawer>
  </div>
</template>

<script>
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
  },
};
</script>

<style scoped lang="scss"></style>
