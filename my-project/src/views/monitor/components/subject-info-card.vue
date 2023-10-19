<template>
  <a-card title="专业布局概览">
    <subject-info />
  </a-card>
</template>

<script>
import SubjectInfo from './charts/subject-info.vue'
export default {
  components: { SubjectInfo },
  name: 'SubjectInfoCard'
}
</script>

<style lang="less" scoped>
/deep/.ant-card-body {
  height: 430px;
}
</style>
