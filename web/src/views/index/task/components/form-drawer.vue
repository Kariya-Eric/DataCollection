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
      <div slot="title">
        <div slot="title" class="titleSlot">
          <span>{{ formName }}</span>
          <div class="titleButton">
            <Mbutton name="下载导入模板" />
            <Mbutton type="primary" name="导入" />
            <Mbutton type="primary" name="导出数据" />
            <Mbutton type="primary" name="保存" />
            <Mbutton type="primary" name="提交" @click="submit" />
            <Mbutton name="返回" icon="返回" @click="onClose" />
          </div>
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
      formName: "",
    };
  },
  methods: {
    show(formConf, formName) {
      this.formName = formName;
      this.formConf = formConf;
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },

    submit() {},
  },
};
</script>

<style scoped lang="scss"></style>
