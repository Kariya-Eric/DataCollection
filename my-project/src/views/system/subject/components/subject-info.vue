<template>
  <a-spin :spinning="loading">
    <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules"> </a-form-model>
  </a-spin>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'SubjectInfo',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {}
    }
  },

  methods: {}
}
</script>

<style scoped lang="less"></style>
