<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>协作进度</span>
      <div class="title-operator-button">
        <a-button type="primary"><dc-icon type="icon-dc_remind" />一键催办</a-button>
        <a-button type="primary"><dc-icon type="icon-dc_form_table" />查看表单</a-button>
        <a-button @click="close"><dc-icon type="icon-dc_back" />返回</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <a-divider dashed style="margin: 12px 0px" />
      <div style="margin-bottom: 12px">
        <div class="img-div" style="display: inline-block"><img src="@/assets/icons/depart.svg" /><span style="margin-left: 8px">负责部门</span></div>
        <div class="img-div" style="display: inline-block; margin-left: 32px"><img src="@/assets/icons/depart_yellow.svg" /><span style="margin-left: 8px">协作部门</span></div>
      </div>
      <a-table bordered rowKey="id" :dataSource="dataSource" :loading="loading" :columns="columns" :pagination="false" :expandedRowKeys="expandedKeys">
        <template slot="expandIcon" slot-scope="props">
          <span style="margin-left: 12px; margin-right: 12px; font-size: 10px">
            <a-icon type="down" v-if="props.expanded" @click="() => props.onExpand()" />
            <a-icon type="right" v-if="!props.expanded && props.record.children.length > 0" @click="() => props.onExpand()" />
          </span>
        </template>
      </a-table>
    </a-spin>
  </a-drawer>
</template>

<script>
import { collaborationProgress } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'ProgressDrawer',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      formInfo: {},
      dataSource: [],
      expandedKeys: [],
      columns: [
        { title: '部门', dataIndex: 'orgName' },
        { title: '填报人', dataIndex: 'fillUserName' },
        { title: '最新提交时间', dataIndex: 'statisticsEndTime' },
        { title: '审核状态', scopedSlots: { customRender: 'status' } },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },

  methods: {
    show(info) {
      this.loading = true
      this.formInfo = info
      collaborationProgress(info.taskFormId)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.children
            this.setExpandedKeys(this.dataSource)
          }
        })
        .finally(() => (this.loading = false))
      this.visible = true
    },

    setExpandedKeys(dataSource) {
      dataSource.forEach(ele => {
        if (ele.children && ele.children.length > 0) {
          this.expandedKeys.push(ele.id)
          this.setExpandedKeys(ele.children)
        }
      })
    },

    close() {
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
</style>
