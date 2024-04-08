<template>
  <div class="main-form">
    <a-row :gutter="24">
      <a-col :span="6">
        <div :style="{ maxHeight: screenHeight - 480 + 'px', overflow: 'auto', paddingRight: '8px' }">
          <a-form-item label="负责部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-search placeholder="输入部门名称搜索" allowClear @change="searchDepart" />
          </a-form-item>
          <a-tree
            :tree-data="treeData"
            :expanded-keys="expandedKeys"
            :replace-fields="replaceFields"
            blockNode
            :auto-expand-parent="autoExpandParent"
            @expand="onExpand"
            @select="onSelect"
            :selected-keys="selectedKeys"
          >
            <template slot="title" slot-scope="item">
              <div class="img-div">
                <img src="@/assets/icons/depart.svg" />
                <span v-if="item.name.indexOf(searchValue) > -1" style="margin-left: 8px">
                  {{ item.name.substr(0, item.name.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ item.name.substr(item.name.indexOf(searchValue) + searchValue.length) }}
                </span>
                <span v-else style="margin-left: 8px">{{ item.name }}</span>
              </div>
            </template>
          </a-tree>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="right-side">
          <div class="header">
            <a-row>
              <span style="margin-right: 12px">权限配置状态</span>
              <a-select v-model="statusOptions" @change="changeStatus" style="width: 25%">
                <a-select-option :value="0">全部</a-select-option>
                <a-select-option :value="1">已配置</a-select-option>
                <a-select-option :value="2">未配置</a-select-option>
              </a-select>
              <div style="float: right">
                <a-button type="primary" @click="copyPermission" style="margin-right: 12px"><dc-icon type="icon-dc_copy" />复制其他任务权限</a-button>
                <a-button type="primary" @click="applyPermissionBatch"><dc-icon type="icon-dc_batch_config" />批量配置权限</a-button>
              </div>
            </a-row>
          </div>

          <a-table
            rowKey="formId"
            :dataSource="configFormList"
            :pagination="false"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :scroll="{ y: screenHeight - 600 }"
          >
            <template slot="formName" slot-scope="text, record">
              <a-popover placement="right">
                <template slot="content">
                  <div><dc-icon type="icon-dc_form_table" :style="{ color: '#2B9E77' }" /><span style="margin-left: 8px">固定表单</span></div>
                  <div style="margin-top: 8px"><dc-icon type="icon-dc_form_table" :style="{ color: '#2F68BD' }" /><span style="margin-left: 8px">浮动表单</span></div>
                </template>
                <dc-icon type="icon-dc_form_table" :style="{ color: record.formType === '固定表单' ? '#2B9E77' : '#2F68BD' }" />
              </a-popover>
              <span style="margin-left: 8px">{{ record.formName }}</span>
            </template>
            <template slot="configStatus" slot-scope="text, record">
              <dc-status v-if="record.configStatus" color="green" name="已配置" />
              <dc-status v-else color="grey" name="未配置" />
            </template>
            <template slot="action" slot-scope="text, record">
              <a @click="applyPermission(record)">配置权限</a>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <div class="footer">
      <a-button type="primary" @click="frontStep">上一步</a-button>
      <a-button type="primary" @click="save">保存</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
      <a-button @click="back">返回</a-button>
    </div>
    <copy-permission-modal ref="copyPermissionModal" :taskId="taskInfo.id" @close="refresh" />
    <permission-modal ref="permissionModal" :forms="configFormList" :taskId="taskInfo.id" :departs="departList" @refresh="refreshPermission" @close="selectedRowKeys = []" />
  </div>
</template>

<script>
const dataList = []
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
import CopyPermissionModal from './copy-permission-modal'
import PermissionModal from './permission-modal'
import { initDeptTree } from '@/api/system/depart'
import { USER_INFO } from '@/store/mutation-types'
import { getTaskFormList } from '@/api/task'
import storage from 'store'
export default {
  name: 'TaskStepThird',
  components: { CopyPermissionModal, PermissionModal },
  props: ['task'],
  data() {
    return {
      screenHeight: window.innerHeight,
      labelCol: { style: 'width: 80px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 80px); display: inline-block;' },
      searchValue: '',
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      departList: [],
      departFilter: '',
      taskInfo: this.task,
      statusOptions: 0,
      formList: [],
      configFormList: [],
      loading: false,
      selectedRowKeys: [],
      columns: [
        { title: '表单名称', align: 'center', scopedSlots: { customRender: 'formName' }, width: 240, ellipsis: true },
        { title: '权限配置状态', align: 'center', scopedSlots: { customRender: 'configStatus' }, width: 120 },
        { dataIndex: 'responsibleOrgName', title: '负责部门', align: 'center', ellipsis: true },
        { dataIndex: 'collaborateOrgName', title: '协作部门', align: 'center', ellipsis: true },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' }, width: 120 }
      ]
    }
  },

  mounted() {
    this.initDepart()
    this.initData()
  },

  methods: {
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.id
        dataList.push({ key, title: node.name })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },

    onSelect(selectedKeys, { selectedNodes }) {
      this.selectedKeys = selectedKeys
      if (selectedKeys.length > 0) {
        const value = selectedNodes[0].data.props.dataRef
        this.selectDepart(value)
      } else {
        this.configFormList = this.formList
      }
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    searchDepart(e) {
      const value = e.target.value
      this.generateList(this.treeData)
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },

    selectDepart(val) {
      if (val.grade == 'COMMON' && val.name != '职能部门' && val.name != '教学部门') {
        //顶级
        this.changeStatus(this.statusOptions)
      } else if (val.grade == 'COMMON' && (val.name == '职能部门' || val.name == '教学部门')) {
        //二级
        let ids = val.children.map(dept => dept.name)
        if (this.statusOptions == 0) {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1
          })
        } else if (this.statusOptions == 1) {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1 && form.configStatus
          })
        } else {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1 && !form.configStatus
          })
        }
      } else if (val.grade != 'COMMON') {
        if (this.statusOptions == 0) {
          this.configFormList = this.formList.filter(form => form.responsibleOrgName == val.name)
        } else if (this.statusOptions == 1) {
          this.configFormList = this.formList.filter(form => form.configStatus && form.responsibleOrgName == val.name)
        } else {
          this.configFormList = this.formList.filter(form => !form.configStatus && form.responsibleOrgName == val.name)
        }
      }
    },

    initData() {
      const { id, formCollectionId } = this.taskInfo
      this.loading = true
      getTaskFormList({ taskId: id, formCollectionId })
        .then(res => {
          if (res.state) {
            this.formList = res.value.filter(item => item.isCanFill)
            this.changeStatus(0)
          }
        })
        .finally(() => (this.loading = false))
    },

    refresh() {
      this.selectedRowKeys = []
      this.initData()
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys
    },

    changeStatus(val) {
      if (val == 0) {
        this.configFormList = this.formList
      }
      if (val == 1) {
        this.configFormList = this.formList.filter(form => form.configStatus)
      }
      if (val == 2) {
        this.configFormList = this.formList.filter(form => !form.configStatus)
      }
    },

    initDepart() {
      let userInfo = storage.get(USER_INFO)
      initDeptTree(userInfo.userId).then(res => {
        if (res.state) {
          this.departList = res.value[0].children
          this.expandedKeys = res.value[0].children.map(ele => ele.id)
          this.expandedKeys.push(res.value[0].id)
          res.value[0].children.forEach(dept => (dept.children = dept.children.filter(item => item.status === 1)))
          this.treeData = this.renderDepart(res.value)
        }
      })
    },

    //处理disable属性
    renderDepart(depart) {
      depart.forEach(dept => {
        if (dept.children && dept.children.length > 0) {
          this.renderDepart(dept.children)
        }
        dept.disabled = dept.disabled !== '1' && dept.disabled !== 1
      })
      return depart
    },

    applyPermissionBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请至少选择一行')
        return
      }
      this.$refs.permissionModal.edit(this.selectedRowKeys)
    },

    applyPermission(row) {
      this.$refs.permissionModal.edit(row)
    },

    refreshPermission(permissionForm) {
      this.selectedRowKeys = []
      this.selectedKeys = []
      this.searchValue = ''
      this.initData()
    },
    copyPermission() {
      this.$refs.copyPermissionModal.show()
    },

    frontStep() {
      this.$emit('change', 1)
    },

    nextStep() {
      let forms = this.formList.filter(form => !form.responsibleOrgName)
      if (forms.length > 0) {
        this.$message.error('存在表单尚未配置负责部门，请检查!')
        return
      }
      this.$emit('change', 3)
    },

    back() {
      this.$emit('back')
    },

    save() {
      let forms = this.formList.filter(form => !form.responsibleOrgName)
      if (forms.length > 0) {
        this.$message.error('存在表单尚未配置负责部门，请检查!')
        return
      } else {
        //安慰剂弹框
        this.$message.success('保存成功!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 24px;
  .headerButton {
    margin-right: 0px;
  }
}
.main-form {
  width: 80%;
  margin: auto;
}
.right-side {
  padding-left: 24px;
  border-left: 1px solid #e8e8e8;
}

.footer {
  margin-top: 36px;
  text-align: center;
  .ant-btn {
    margin-left: 24px;
  }
}
</style>
