<template>
  <el-card shadow="always" class="app-card">
    <dc-vxe-table toolbar rowNumber drag-sort keep-source :dataSource="dataSource" :columns="columns" @sort="sort"> </dc-vxe-table>
  </el-card>
</template>

<script>
import { DCVXETypes } from '@/components/DCVxeTable'
export default {
  data() {
    return {
      dataSource: [],
      columns: [
        { title: '字段', key: 'fieldName', type: DCVXETypes.inputMail, align: 'center', titleHelp: { content: '123' } },
        {
          title: '字段',
          key: 'fieldName2',
          type: DCVXETypes.inputLink,
          align: 'center',
          placeholder: '请输入1',
          validateRules: [
            {
              required: true,
              message: '请输入${title}'
            },
            {
              unique: true,
              message: '${title}不能重复'
            }
          ]
        },
        { title: '字段', key: 'fieldName2', type: DCVXETypes.inputPhone, align: 'center' }
      ]
    }
  },
  methods: {
    sort(data) {
      this.dataSource = []
      this.$nextTick(() => (this.dataSource = data))
    }
  }
}
</script>

<style></style>
