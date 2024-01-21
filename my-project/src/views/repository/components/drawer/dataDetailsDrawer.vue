<template>
  <a-drawer v-if="visible" :visible="visible" :width="1000" :closable="false">
    <div class="title-operator" slot="title">
      <span>{{ title }}</span>
      <div class="title-operator-button">
        <a-button @click="close"><dc-icon type="icon-dc_back" />返回</a-button>
      </div>
    </div>
    <a-spin :spinning="spinning">
      <div class="table-info-list">
        <div class="table-info-item" v-for="(item, index) in formInfo" :key="index">
          <span v-for="subitem in item" :key="subitem.dataIndex">{{ subitem.title }}：{{ fieldInfo[subitem.dataIndex] }}</span>
        </div>
      </div>
      <a-table rowKey="id" :dataSource="fieldInfo" :columns="columns"> </a-table>
    </a-spin>
  </a-drawer>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'DataDetailsDrawer',
  mixins: [DataCollectionModalMixin],
  props: ['dataSource'],
  data() {
    return {
      title: '数据来源',
      fieldInfo: {},
      spinning: false,
      formInfo: [
        [{ title: '表单名称', dataIndex: 'formName' }],
        [
          { title: '填报时间', dataIndex: 'name' },
          { title: '填报部门', dataIndex: 'collectTimeType' },
          { title: '填报人', dataIndex: 'type' }
        ],
        [
          { title: '审核时间', dataIndex: 'name' },
          { title: '审核部门', dataIndex: 'collectTimeType' },
          { title: '审核人', dataIndex: 'type' }
        ]
      ],
      columns: [
        { title: '统计时间', dataIndex: 'createTime' },
        { title: '教学科研单位名称', dataIndex: 'name' },
        { title: '单位号', dataIndex: 'collectTimeType' },
        { title: '单位职能', dataIndex: 'type' }
      ]
    }
  },
  methods: {
    show(formName, record) {
      this.fieldInfo = { formName, ...record }
      this.visible = true
    },

    close() {
      this.$emit('refresh')
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.title-operator {
  > span {
    font-size: 18px;
    font-weight: 600;
    line-height: 32px;
  }
  .title-operator-button {
    float: right;
    button {
      margin-left: 6px;
      margin-right: 6px;
    }
  }
}
.table-info-list {
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px dashed #ccc;
  margin-top: -10px;
  .table-info-item {
    display: flex;
    flex-wrap: wrap;
    span {
      display: inline-block;
      margin-right: 100px;
    padding: 10px 0;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>
