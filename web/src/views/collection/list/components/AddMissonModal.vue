<template>
  <div>
    <a-modal
      title="添加任务"
      v-model:visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      fullscreen
    >
      <div>
        <a-steps :current="2">
          <a-step>基础信息</a-step>
          <a-step>表单配置</a-step>
          <a-step>权限配置</a-step>
          <a-step>任务配置完成</a-step>
        </a-steps>
        <div style="line-height: 140px; text-align: center; color: #c9cdd4">
          <a-form>
            <a-row :gutter="24">
              <a-col :md="12" :sm="4">
                <a-form-item field="missonType" label="任务类型">
                  <a-select
                    :style="{ width: '320px' }"
                    placeholder="请选择任务类型"
                  >
                    <a-option>全部</a-option>
                    <a-option>教学基本状态数据</a-option>
                    <a-option>其他数据</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="4">
                <a-form-item label="任务名称">
                  <a-input placeholder="输入任务名称模糊匹配" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="12" :sm="4">
                <a-form-item label="统计开始时间">
                  <a-input placeholder="输入任务名称模糊匹配" /> </a-form-item
              ></a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
      };
    },
    created() {},
    mounted() {},
    methods: {
      show() {
        this.visible = true;
      },

      handleOk() {
        this.visible = false;
      },

      handleCancel() {
        this.visible = false;
      },
    },
  };
</script>

<style scoped lang="less"></style>
