<template>
  <el-dialog
    v-if="visible"
    :visible="visible"
    fullscreen
    :show-close="false"
    :append-to-body="true"
  >
    <div slot="title" class="titleSlot">
      <span
        ><el-tag type="warning" style="margin-right: 24px">{{
          info.type
        }}</el-tag>
        {{ info.name }}（{{ info.collectTimeType }}）</span
      >
      <div style="display: inline-block; margin-left: 30%">
        <Mbutton
          type="text"
          name="表单设计"
          @click="() => (this.activeTab = 0)"
          :class="{ active: activeTab == 0, inactive: activeTab == 1 }"
        />
        <Mbutton
          type="text"
          name="校验规则"
          @click="() => (this.activeTab = 1)"
          :class="{ active: activeTab == 1, inactive: activeTab == 0 }"
        />
      </div>
      <div class="titleButton">
        <Mbutton type="danger" @click="empty" name="清空" />
        <Mbutton type="primary" @click="view" name="预览" />
        <Mbutton type="primary" @click="save" name="保存" />
        <Mbutton name="返回" icon="返回" @click="close" />
      </div>
    </div>

    <div v-show="activeTab === 0">
      <form-generator
        :formInfo="info"
        :drawingList="drawingList"
        :form-config="formConfig"
        ref="formGenerator"
        @view="showView"
        @save="saveForm"
      />
    </div>
    <div class="container" v-show="activeTab === 1">
      <rule-detail :drawingList="drawingList" :rules="rules" />
    </div>
    <form-view-drawer ref="formViewDrawer" />
  </el-dialog>
</template>

<script>
import FormViewDrawer from "./form-view-drawer.vue";
import RuleDetail from "./rule-detail";
import { updateForm } from "@/api/form";
export default {
  name: "FormGeneartorDialog",
  components: { FormViewDrawer, RuleDetail },
  data() {
    return {
      visible: false,
      info: {},
      activeTab: 0,
      drawerVisible: false,
      drawingList: [],
      formConfig: null,
      rules: [],
    };
  },
  methods: {
    show(formInfo) {
      this.info = JSON.parse(JSON.stringify(formInfo));
      let formConfig = JSON.parse(formInfo.formProperties);
      let drawingList = JSON.parse(formInfo.componentProperties);
      if (formConfig != null) {
        this.formConfig = formConfig;
      }
      if (drawingList != null) {
        this.drawingList = drawingList;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.info = {};
      this.activeTab = 0;
      this.formConfig = null;
      this.drawingList = [];
    },

    view() {
      this.$refs.formGenerator.view();
    },

    showView(formData) {
      this.$refs.formViewDrawer.show(formData);
    },

    empty() {
      this.drawingList = [];
    },

    save() {
      this.$refs.formGenerator.save();
    },

    saveForm(formData) {
      const { fields } = formData;
      Reflect.deleteProperty(formData, "fields");
      Reflect.deleteProperty(formData, "formBtns");
      const params = {
        ...this.info,
        formProperties: JSON.stringify(formData),
        componentProperties: JSON.stringify(fields),
      };
      this.loading = true;
      updateForm(params)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
          this.close();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.active {
  font-size: 18px;
  padding-bottom: 32px;
  border-bottom: 6px solid;
}
.inactive {
  font-size: 18px;
  color: #4a4c51;
}
::v-deep .el-dialog__body {
  padding: 8px;
}
::v-deep .el-dialog__header {
  height: 52px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
}
</style>
