<template>
  <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card title="专业架构">
        <a-button type="primary" slot="extra" @click="handleAdd">添加专业</a-button>
        <a-spin :spinning="loading">
          <a-form-item label="专业名称" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
            <a-input-search placeholder="请输入专业名称搜索" allowClear @change="searchSubject" />
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
                <a @click.stop="editSubject(item)">修改</a>
                <a-popconfirm title="确认删除吗？" @confirm="delSubject(item)">
                  <a @click.stop>删除</a>
                </a-popconfirm>
              </span>
            </template>
          </a-tree>
        </a-spin>
        <subject-modal ref="modalForm" :orgs="departList" @refresh="initSubject" />
      </a-card>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :tab-list="tabList" :active-tab-key="activeKey" @tabChange="key => (activeKey = key)">
        <div v-if="activeKey === '1'">
          <a-empty v-if="selectedKeys.length == 0">
            <span slot="description"> 请先选择一个专业! </span>
          </a-empty>
          <subject-info v-else :orgs="departList" :subject="subjectInfo" :isEdit="editFlag" @refresh="initSubject" />
        </div>
        <div v-if="activeKey === '2'">
          <a-empty v-if="selectedKeys.length == 0">
            <span slot="description"> 请先选择一个专业! </span>
          </a-empty>
          <subject-user v-else :subject="subjectInfo" :roles="roleList" :isEdit="editFlag" @refresh="initSubject" />
        </div>
      </a-card>
    </a-col>
  </a-row>
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

import { initDeptTree } from '@/api/system/depart'
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import SubjectInfo from './components/subject-info'
import SubjectUser from './components/subject-user'
import { getSubjectTree, delSubject } from '@/api/system/subject'
import SubjectModal from './components/subject-modal.vue'
import { getRoleList } from '@/api/system/role'
export default {
  name: 'SubjetList',
  components: { SubjectInfo, SubjectModal, SubjectUser },
  data() {
    return {
      roleList: [],
      subjectInfo: {},
      departList: [],
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
        { key: '1', tab: '专业信息' },
        { key: '2', tab: '人员信息' }
      ]
    }
  },
  created() {
    this.initSubject()
    this.initDepart()
    this.initRoleList()
  },

  methods: {
    initRoleList() {
      getRoleList({}).then(res => {
        if (res.state) {
          this.roleList = res.value.rows.filter(role => role.enabled == 1)
        }
      })
    },
    initDepart() {
      let userInfo = storage.get(USER_INFO)
      initDeptTree(userInfo.userId).then(res => {
        if (res.state) {
          this.departList = res.value[0].children.find(item => item.name == '教学部门').children.filter(item => item.status == 1)
        }
      })
    },

    handleAdd() {
      this.$refs.modalForm.add()
    },
    initSubject() {
      this.loading = true
      getSubjectTree()
        .then(res => {
          if (res.state) {
            this.treeData = this.renderSubject(res.value)
            this.setExpandKeys(this.treeData)
          }
        })
        .finally(() => (this.loading = false))
    },

    setExpandKeys(subject) {
      subject.forEach(sub => {
        if (sub.children && sub.children.length > 0) {
          this.expandedKeys.push(sub.id)
          this.setExpandKeys(sub.children)
        }
      })
    },

    //处理disable属性
    renderSubject(subject) {
      subject.forEach(subj => {
        if (subj.children && subj.children.length > 0) {
          this.renderSubject(subj.children)
        }
        if (subj.type === 'SUBJECT') {
          subj.scopedSlots = { title: 'custom' }
        }
      })
      return subject
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

    searchSubject(e) {
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

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    onSelect(selectedKeys, { selectedNodes }) {
      if (selectedKeys.length > 0) {
        if (selectedNodes[0].data.props.type !== 'SUBJECT') {
          this.selectedKeys = []
        } else {
          this.subjectInfo = selectedNodes[0].data.props.dataRef
          this.selectedKeys = selectedKeys
          this.editFlag = false
        }
      } else {
        this.selectedKeys = selectedKeys
        this.editFlag = false
      }
    },

    editSubject(item) {
      this.subjectInfo = item
      this.selectedKeys = [item.id]
      this.editFlag = true
    },

    delSubject(item) {
      this.loading = true
      delSubject({ id: item.id })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initSubject()
            this.selectedKeys = []
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
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
