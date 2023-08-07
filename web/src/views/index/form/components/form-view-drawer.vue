<template>
  <div>
    <el-drawer
      :append-to-body="true"
      vif="visible"
      :visible="visible"
      @close="onClose"
      :show-close="false"
      size="80%"
    >
      <div slot="title" class="titleSlot">
        <span>表单预览</span>
        <div class="titleButton">
          <mbutton name="返回" icon="返回" @click="onClose" />
        </div>
      </div>
      <form-view :formConf="formConf" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      formConf: {},
    };
  },

  methods: {
    show(formConf) {
      console.log("1", formConf);
      this.formConf = formConf;
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
