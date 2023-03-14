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
        <div class="modalDiv" style="margin-top: 20px; margin-bottom: 50px">
          <a-steps changeable :current="current" @change="setCurrent">
            <a-step>基础信息</a-step>
            <a-step>表单配置</a-step>
            <a-step>权限配置</a-step>
            <a-step>任务配置完成</a-step>
          </a-steps>
        </div>
        <add-mission-first-step v-if="current == 1" />
        <add-mission-second-step v-if="current == 2" />
        <add-mission-third-step v-if="current == 3" />
        <add-mission-fourth-step v-if="current == 4" @close="handleCancel" />
        <a-divider  />
        <div class="modalDiv" style="margin-top: 40px">
          <a-row :gutter="24">
            <a-col :span="8" :offset="8">
              <a-button
                type="primary"
                size="large"
                :disabled="current <= 1"
                @click="prev"
              >
                <icon-left />
                &nbsp;&nbsp;上一步
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button
                type="primary"
                size="large"
                :disabled="current >= 4"
                @click="next"
              >
                下一步&nbsp;&nbsp;
                <icon-right />
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import AddMissionFirstStep from './AddMissionFirstStep.vue';
  import AddMissionSecondStep from './AddMissionSecondStep.vue';
  import AddMissionThirdStep from './AddMissionThirdStep.vue';
  import AddMissionFourthStep from './AddMissionFourthStep.vue';

  export default {
    name: 'AddMissionModal',
    components: {
      AddMissionFirstStep,
      AddMissionSecondStep,
      AddMissionThirdStep,
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

      prev() {
        this.current -= 1;
      },

      next() {
        this.current += 1;
      },
    },
  };
</script>

<style scoped lang="less"></style>
