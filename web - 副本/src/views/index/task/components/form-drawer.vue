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
            <mbutton
              type="primary"
              name="保存"
              @click="save"
              icon="保存"
              v-if="showType == 0 || showType == 3"
            />
            <mbutton
              type="primary"
              name="提交"
              @click="submit"
              icon="提交"
              v-if="showType == 0 || showType == 3"
            />
            <mbutton name="返回" icon="返回" @click="onClose" />
          </div>
        </div>
        <div :class="`showType_${type.class}`" v-if="type.title">
          <svg-icon :icon-class="type.title" />
          <span>{{ type.title }}</span>
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
      showType: -1,
    };
  },
  computed: {
    type() {
      if (this.showType == 0) {
        return { title: "待提交", class: "fill" };
      } else if (this.showType == 1) {
        return { title: "审核中", class: "audit" };
      } else if (this.showType == 3) {
        return { title: "退回修改", class: "redo" };
      }
      return {};
    },
  },
  methods: {
    show(formConf, formName, formId, showType) {
      this.formName = formName;
      this.formConf = formConf;
      this.formId = formId;
      this.showType = showType;
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

<style scoped lang="scss">
.showType_fill {
  background-color: #eeefef;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
}
.showType_audit {
  background-color: #e6efff;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
}
.showType_redo {
  background-color: #fde0dd;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
}
/deep/.el-drawer__body {
  padding-top: 0;
}
</style>
