<template>
  <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card title="组织架构">
        <a-button type="primary" slot="extra" @click="handleAdd">添加组织</a-button>
        <a-spin :spinning="loading">
          <a-form-item label="部门名称" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
            <a-input-search placeholder="请输入部门名称搜索" allowClear @change="searchDepart" />
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
            <template slot="custom" slot-scope="item">
              <span v-if="item.name.indexOf(searchValue) > -1">
                {{ item.name.substr(0, item.name.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ item.name.substr(item.name.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ item.name }}</span>
              <span class="custom-tree-node">
                <a @click.stop="editDept(item)">修改</a>
                <a>删除</a>
              </span>
            </template>
          </a-tree>
        </a-spin>
        <depart-modal ref="modalForm" @ok="initDepart" :departs="treeData" />
      </a-card>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :tab-list="tabList" :active-tab-key="activeKey" @tabChange="key => (activeKey = key)">
        <p v-if="activeKey === '1'">
          <a-empty v-if="selectedKeys.length == 0">
            <span slot="description"> 请先选择一个部门! </span>
          </a-empty>
          <depart-info v-else :users="userList" :isEdit="editFlag" :orgId="selectedKeys[0]" @refresh="initDepart" />
        </p>
        <p v-if="activeKey === '2'">
          <a-empty v-if="selectedKeys.length == 0">
            <span slot="description"> 请先选择一个部门! </span>
          </a-empty>
          <depart-user v-else :roles="roleList" :orgId="selectedKeys[0]" @refresh="refreshUser" />
        </p>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { getUserList } from '@/api/system/user'
import { getRoleList } from '@/api/system/role'
import DepartInfo from './components/depart-info.vue'
import DepartUser from './components/depart-user.vue'
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import { initDeptTree } from '@/api/system/depart'
import DepartModal from './components/depart-modal.vue'

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
export default {
  name: 'DepartList',
  components: { DepartInfo, DepartUser, DepartModal },
  data() {
    return {
      userList: [],
      roleList: [],
      searchValue: '',
      editFlag: false,
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      loading: false,
      selectedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      activeKey: '1',
      tabList: [
        { key: '1', tab: '组织信息' },
        { key: '2', tab: '人员信息' }
      ]
    }
  },
  created() {
    this.initDepart()
    this.initUserList()
    this.initRoleList()
  },

  methods: {
    handleAdd() {
      this.$refs.modalForm.add()
    },

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

    initDepart() {
      this.loading = true
      initDeptTree(storage.get(USER_INFO).userId)
        .then(res => {
          if (res.state) {
            this.expandedKeys = res.value[0].children.map(ele => ele.id)
            this.expandedKeys.push(res.value[0].id)
            this.treeData = this.renderDepart(res.value)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
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

    //处理disable属性
    renderDepart(depart) {
      depart.forEach(dept => {
        if (dept.children && dept.children.length > 0) {
          this.renderDepart(dept.children)
        }
        dept.disabled = dept.disabled !== '1' && dept.disabled !== 1
        if (dept.grade === 'ORG') {
          dept.scopedSlots = { title: 'custom' }
        }
      })
      return depart
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    onSelect(selectedKeys, { selectedNodes }) {
      if (selectedKeys.length > 0) {
        if (selectedNodes[0].data.props.grade !== 'ORG') {
          this.selectedKeys = []
        } else {
          this.selectedKeys = selectedKeys
          this.editFlag = false
        }
      } else {
        this.selectedKeys = selectedKeys
        this.editFlag = false
      }
    },

    initUserList() {
      getUserList({}).then(res => {
        if (res.state) {
          this.userList = res.value.rows
        }
      })
    },

    initRoleList() {
      getRoleList({}).then(res => {
        if (res.state) {
          this.roleList = res.value.rows.filter(role => role.enabled == 1)
        }
      })
    },

    editDept(item) {
      this.selectedKeys = [item.id]
      this.editFlag = true
    },

    refreshUser() {
      this.initUserList()
    }
  }
}
</script>

<style scoped lang="less">
.custom-tree-node {
  float: right;
  a {
    margin-right: 8px;
  }
  visibility: hidden;
}
.ant-tree-node-content-wrapper:hover .custom-tree-node {
  visibility: visible;
}
</style>
