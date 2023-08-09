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
            <mbutton name="下载导入模板" />
            <mbutton type="primary" name="导入" />
            <mbutton type="primary" name="导出数据" />
            <mbutton type="primary" name="保存" @click="save" />
            <mbutton type="primary" name="提交" @click="submit" />
            <mbutton name="返回" icon="返回" @click="onClose" />
          </div>
        </div>
      </div>
      <form-view
        :formConf="formConf"
        @save="saveForm"
        @submit="submitForm"
        ref="formview"
      />
    </el-drawer>
  </div>
</template>

<script>
import { updateTaskFormDetail, submitForm } from "@/api/task";
export default {
  data() {
    return {
      visible: false,
      formConf: {},
      formName: "",
      formId: "",
    };
  },
  methods: {
    show(formConf, formName, formId) {
      this.formName = formName;
      this.formConf = formConf;
      this.formId = formId;
      this.visible = true;
    },

    onClose() {
      this.$emit("refresh");
      this.visible = false;
    },

    save() {
      this.$refs.formview.save();
    },

    submit() {
      this.$refs.formview.submit();
    },

    saveForm(value) {
      updateTaskFormDetail({
        id: this.formId,
        formData: JSON.stringify(value),
      }).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
        } else {
          this.$message.warning(res.message);
        }
      });
    },

    submitForm(value) {
      submitForm({
        id: this.formId,
        formData: JSON.stringify(value),
      }).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.onClose();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
