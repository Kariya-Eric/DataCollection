<template>
  <div>
    <a-table rowKey="field" :dataSource="dataSource" :pagination="false" :loading="loading" :columns="columns">
      <template slot="required" slot-scope="text, record">
        {{ record.required ? `是` : `否` }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a v-if="record.options" @click="showDetail(record)">查看选项值</a>
      </template>
    </a-table>
    <FieldPropsDrawer ref="formDrawer" />
  </div>
</template>
<script>
import api from '@/api/repository'
import FieldPropsDrawer from './drawer/fieldPropsDrawer.vue'
export default {
  name: 'FieldProps',
  components: { FieldPropsDrawer },
  props: {
    formName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      columns: [
        { title: '业务字段名', dataIndex: 'label' },
        { title: '物理字段名', dataIndex: 'field' },
        { title: '是否必填', scopedSlots: { customRender: 'required' } },
        { title: '组件类型', dataIndex: 'typeName' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ]
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    loadData() {
      const { formid } = this.$route.query
      if (!formid) return
      this.loading = true
      api
        .getConfigList(formid)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    showDetail(record) {
      this.$refs.formDrawer.show(this.formName, record)
    }
  }
}
</script>
<style scoped lang="less"></style>
