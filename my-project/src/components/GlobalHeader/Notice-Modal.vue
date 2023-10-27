<template>
  <a-modal title="消息通知" :visible="visible" :confirmLoading="loading" @cancel="close" :footer="null" :maskClosable="false" :keyboard="false" width="35%" destroyOnClose>
    <a-tabs v-model="currentTab" @change="changeTabs">
      <a-tab-pane tab="全部" :key="1">
        <a-list item-layout="horizontal" :data-source="notices">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta :description="item.pushTime">
              <a slot="title">{{ item.content }}</a>
            </a-list-item-meta>
            <div><a-button type="primary" @click="showTask(item)">查看</a-button></div>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane tab="已读" :key="2">
        <a-list item-layout="horizontal" :data-source="notices">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta :description="item.pushTime">
              <a slot="title">{{ item.content }}</a>
            </a-list-item-meta>
            <div><a-button type="primary" @click="showTask(item)">查看</a-button></div>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane :tab="`未读(${number})`" :key="3">
        <a-list item-layout="horizontal" :data-source="notices">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta :description="item.pushTime">
              <a slot="title">{{ item.content }}</a>
            </a-list-item-meta>
            <div><a-button type="primary" @click="showTask(item)">查看</a-button></div>
          </a-list-item>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { list } from '@/api/notice'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'NoticeModal',
  mixins: [DataCollectionModalMixin],
  props: ['number'],
  data() {
    return {
      notices: [],
      currentTab: 3
    }
  },
  methods: {
    close() {
      this.visible = false
    },

    show() {
      this.currentTab = 3
      this.showList(0)
      this.visible = true
    },

    showList(type) {
      let param = { params: { readStatus: type } }
      this.loading = true
      list(param)
        .then(res => {
          if (res.state) {
            this.notices = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    changeTabs(val) {
      if (val == 1) {
        this.showList()
      } else if (val == 2) {
        this.showList(1)
      } else {
        this.showList(0)
      }
    },

    showTask(notice) {
      this.close()
      this.$router.push({
        path: notice.targetLink
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body {
  padding: 8px 24px 24px 24px !important;
}
</style>
