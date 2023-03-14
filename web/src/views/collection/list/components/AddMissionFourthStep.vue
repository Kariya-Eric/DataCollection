<template>
  <div class="modalDiv">
    <a-result status="success" title="任务配置已完成">
      <template #extra>
        <a-space>
          <a-button @click="closeModal">返回</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  name: 'AddMissionFourthStep',

  methods: {
    closeModal() {
        this.$emit('close')
    },
  },
};
</script>

<style>
</style>