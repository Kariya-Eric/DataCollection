<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>资源授权</span>
      <div class="title-operator-button">
        <a-button type="primary">保存</a-button>
        <a-button @click="close">返回</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-input-search placeholder="数据关键词过滤菜单" allowClear style="margin-bottom: 12px" />
          <a-tree
            checkable
            blockNode
            :replace-fields="replaceFields"
            checkStrictly
            @select="onSelect"
            :treeData="menuTree"
            :autoExpandParent="autoExpandParent"
            :expandedKeys="expandedKeys"
            @expand="onExpand"
            :checkedKeys="checkedKeys"
            @check="onCheck"
          />
        </a-col>

        <a-col :span="18">
          <a-empty style="margin-top: 64px" v-if="selectedKeys.length == 0">
            <span slot="description"> 选择一个菜单项查看按钮权限 </span>
          </a-empty>
          <a-table
            v-else
            bordered
            rowKey="id"
            :dataSource="sysMethodDataSource"
            :loading="loading"
            :columns="columns"
            :pagination="false"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >
          </a-table>
        </a-col>
      </a-row>
    </a-spin>
  </a-drawer>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getAllMenuByRoleCode, getAllMethodByRoleCode } from '@/api/system/role'
export default {
  name: 'PermissionDrawer',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      selectedRowKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      menuTree: [],
      roleInfo: {},
      checkedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      columns: [
        { dataIndex: 'alias', title: '别名', align: 'center' },
        { dataIndex: 'name', title: '名称', align: 'center' },
        { dataIndex: 'requestUrl', title: '请求地址', align: 'center' }
      ],
      sysMethodDataSource: [],
      sysMethods: []
    }
  },

  methods: {
    show(role) {
      this.roleInfo = JSON.parse(JSON.stringify(role))
      this.initMenu()
      this.initSysMethods()
      this.visible = true
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    close() {
      this.$emit('close')
      this.selectedKeys = []
      this.visible = false
    },

    initMenu() {
      this.loading = true
      getAllMenuByRoleCode(this.roleInfo.code)
        .then(res => {
          if (res.state) {
            this.menuTree = res.value
            this.initExpandAndCheckedKeys(res.value)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    initSysMethods() {
      this.loading = true
      getAllMethodByRoleCode(this.roleInfo.code)
        .then(res => {
          if (res.state) {
            this.sysMethods = res.value
            this.sysMethodDataSource = res.value
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    initExpandAndCheckedKeys(menu) {
      menu.forEach(ele => {
        if (ele.checked == '1') {
          this.checkedKeys.push(ele.id)
        }
        if (ele.children && ele.children.length > 0) {
          this.expandedKeys.push(ele.id)
          this.initExpandAndCheckedKeys(ele.children)
        }
      })
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
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
