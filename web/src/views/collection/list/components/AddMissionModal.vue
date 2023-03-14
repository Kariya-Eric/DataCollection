<template>
  <div>
    <a-modal
      title="添加任务"
      v-model:visible="visible"
      @cancel="handleCancel"
      :footer="false"
      fullscreen
    >
      <div>
        <div>
          <a-steps changeable :current="current" @change="setCurrent">
            <a-step>基础信息</a-step>
            <a-step>表单配置</a-step>
            <a-step>权限配置</a-step>
            <a-step>任务配置完成</a-step>
          </a-steps>
        </div>
        <add-mission-first-step v-if="current == 1" />
        <add-mission-second-step v-if="current == 2" />
        <add-mission-fourth-step v-if="current == 4" @close="handleCancel" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import AddMissionFirstStep from './AddMissionFirstStep.vue';
import AddMissionSecondStep from './AddMissionSecondStep.vue';
import AddMissionFourthStep from './AddMissionFourthStep.vue';

export default {
  name: 'AddMissionModal',
  components: {
    AddMissionFirstStep,
    AddMissionSecondStep,
    AddMissionFourthStep,
  },
  data() {
    return {
      visible: false,
      current: 1,
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

    setCurrent(current) {
      this.current = current;
    },
  },
};
</script>

<style scoped lang="less"></style>
