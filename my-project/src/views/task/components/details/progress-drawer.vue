<template>
  <a-drawer v-if="visible" :visible="visible" :width="1000" :closable="false">
    <a-descriptions :column="1">
      <a-descriptions-item label="表单名称"> {{ formInfo.formName }}</a-descriptions-item>
      <a-descriptions-item label="填报时间"> {{ fillTime }} </a-descriptions-item>
      <a-descriptions-item label="审核人"> {{ formInfo.responsibleUserName }} </a-descriptions-item>
      <a-descriptions-item label="协作进度"><a-progress style="width: 35%" :percent="progress.percent" :format="() => progress.name" /> </a-descriptions-item>
    </a-descriptions>
    <div class="title-operator" slot="title">
      <span>协作进度</span>
      <div class="title-operator-button">
        <a-button type="primary"><dc-icon type="icon-dc_remind" />一键催办</a-button>
        <a-button type="primary"><dc-icon type="icon-dc_form_table" />查看总表</a-button>
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
        <template slot="orgName" slot-scope="text, record">
          <div class="img-div" style="display: inline-block" v-if="record.responsibleOrgId == record.orgId">
            <img src="@/assets/icons/depart.svg" /><span style="margin-left: 12px">{{ record.orgName }}</span>
          </div>
          <div class="img-div" style="display: inline-block" v-else>
            <img src="@/assets/icons/depart_yellow.svg" /><span style="margin-left: 12px">{{ record.orgName }}</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record">
          <dc-status :name="caculateStatus(record.status).name" :color="caculateStatus(record.status).color" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="showDetails(record)">查看</a>
          <a-divider v-if="record.status != 2" type="vertical" />
          <a v-if="record.status != 2">催办</a>
        </template>
      </a-table>
    </a-spin>
    <form-drawer ref="formDrawer" />
  </a-drawer>
</template>

<script>
import { collaborationProgress } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { taskFormDetail } from '@/api/task'
import FormDrawer from './form-drawer'
export default {
  name: 'ProgressDrawer',
  mixins: [DataCollectionModalMixin],
  components: { FormDrawer },
  data() {
    return {
      formInfo: {},
      dataSource: [],
      expandedKeys: [],
      columns: [
        { title: '部门', align: 'center', scopedSlots: { customRender: 'orgName' } },
        { title: '填报人', dataIndex: 'fillUserName', align: 'center' },
        { title: '最新提交时间', dataIndex: 'submitTime', align: 'center' },
        { title: '状态', scopedSlots: { customRender: 'status' }, align: 'center' },
        { title: '操作', scopedSlots: { customRender: 'action' }, align: 'center' }
      ]
    }
  },
  computed: {
    progress() {
      let data = this.dataSource.filter(item => item.status == 2 || item.status == 1)
      return { percent: (data.length / this.dataSource.length) * 100, name: `${data.length}/${this.dataSource.length}` }
    },
    fillTime() {
      return `${this.formInfo.statisticsStartTime} 至 ${this.formInfo.statisticsEndTime}`
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

    caculateStatus(status) {
      if (status == 0) {
        return { color: 'grey', name: '待提交' }
      } else if (status == 1) {
        return { color: 'blue', name: '审核中' }
      } else if (status == 2) {
        return { color: 'green', name: '审核通过' }
      } else if (status == 3) {
        return { color: 'red', name: '退回修改' }
      } else {
        return { color: 'yellow', name: '待配置人员' }
      }
    },

    close() {
      this.visible = false
    },

    showDetails(record) {
      taskFormDetail(record.id).then(res => {
        if (res.state) {
          const formProperties = JSON.parse(res.value.formProperties)
          const fields = JSON.parse(res.value.componentProperties)
          const data = res.value.formData == null ? null : JSON.parse(res.value.formData)
          let formData = { ...formProperties, fields, data }
          this.$refs.formDrawer.show(formData, res.value.formName, res.value.id, res.value.status, record)
        }
      })
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
/deep/.ant-descriptions-item-label {
  font-size: 16px;
  font-weight: bold;
}
/deep/.ant-descriptions-item-content {
  font-size: 16px;
  width: 82%;
}
</style>
