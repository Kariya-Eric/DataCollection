<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>资源授权</span>
      <div class="title-operator-button">
        <a-button type="primary" @click="save">保存</a-button>
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
import { getAllMenuByRoleCode, getAllMethodByRoleCode, saveRoleAuth } from '@/api/system/role'
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
      checkedKeys: {
        checked: [],
        halfChecked: []
      },
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

    save() {
      let arrMethodAlias = []
      if (this.selectedKeys.length == 0) {
        arrMethodAlias = this.sysMethods.filter(item => item.isSelected == '1').map(item => item.id)
      } else {
        this.selectedRowKeys.forEach(id => {
          let sysMethod = this.sysMethodDataSource.find(item => item.id == id)
          arrMethodAlias.push(sysMethod.alias)
        })
      }
      let arrMenuAlias = []
      let flatMenu = []
      this.renderMenu(this.menuTree, flatMenu)
      this.checkedKeys.checked.forEach(id => {
        let menu = flatMenu.find(item => item.id == id)
        arrMenuAlias.push(menu.alias)
      })
      let param = { arrMenuAlias, arrMethodAlias, roleCode: this.roleInfo.code }
      this.loading = true
      saveRoleAuth(param)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    renderMenu(menu, flatMenu) {
      menu.forEach(m => {
        if (m.children && m.children.length > 0) {
          this.renderMenu(m.children, flatMenu)
        }
        flatMenu.push(m)
      })
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    close() {
      this.$emit('close')
      this.selectedKeys = []
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
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
        if (ele.checked != '0') {
          this.checkedKeys.checked.push(ele.id)
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

    onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      this.selectedRowKeys = []
      this.selectedKeys = selectedKeys
      if (selected) {
        const menu = selectedNodes.map(item => item.data.props.dataRef)
        let aliasList = []
        this.flatAlias(menu, aliasList)
        this.sysMethodDataSource = this.sysMethods.filter(sysMethod => aliasList.includes(sysMethod.menuAlias))
        this.selectedRowKeys = this.sysMethodDataSource.filter(item => item.isSelected == '1').map(item => item.id)
      }
    },

    flatAlias(menu, aliasList) {
      menu.forEach(m => {
        if (m.children && m.children.length > 0) {
          this.flatAlias(m.children, aliasList)
        }
        aliasList.push(m.alias)
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
</style>
