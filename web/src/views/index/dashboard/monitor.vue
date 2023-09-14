<template>
  <el-card shadow="always" class="app-card">
    <dc-vxe-table toolbar keep-source :dataSource="dataSource" :columns="columns"> </dc-vxe-table>
  </el-card>
</template>

<script>
import { DCVXETypes } from '@/components/DCVxeTable'
export default {
  data() {
    return {
      dataSource: [],
      columns: [
        { title: '字段', key: 'fieldName', type: DCVXETypes.inputMail, align: 'center' },
        { title: '字段', key: 'fieldName2', type: DCVXETypes.inputLink, align: 'center' },
        { title: '字段', key: 'fieldName2', type: DCVXETypes.inputPhone, align: 'center' }
      ]
    }
  }
}
</script>

<style></style>
