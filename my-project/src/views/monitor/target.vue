<template>
  <div>
    <card-header />
    <a-card>
      <a-table bordered :columns="columns" :datasource="dataSource" />
    </a-card>
  </div>
</template>

<script>
import CardHeader from './components/card-header.vue'
export default {
  components: { CardHeader },
  name: 'MonitorTarget',
  data() {
    return {
      dataSource: [],
      columns: [
        { dataIndex: 'd1', title: '指标名称', align: 'center' },
        { dataIndex: 'd2', title: '2020', align: 'center' },
        { dataIndex: 'd3', title: '2020年', align: 'center' },
        { dataIndex: 'd4', title: '2021年', align: 'center' },
        { dataIndex: 'd5', title: '2022年（同比）', align: 'center' },
        { dataIndex: 'd6', title: '状态', align: 'center' }
      ]
    }
  }
}
</script>

<style></style>
