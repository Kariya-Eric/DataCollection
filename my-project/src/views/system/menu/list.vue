<template>
  <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card title="菜单管理" class="dc-card">
        <template slot="extra">
          <a-button type="primary" style="margin-right: 12px" v-if="selectedKeys.length > 0" @click="$refs.menuModal.show(false, '添加下级菜单', selectedKeys[0])">
            <dc-icon type="icon-dc_new" />添加下级菜单
          </a-button>
          <a-button type="primary" @click="$refs.menuModal.show(true, '添加菜单')"><dc-icon type="icon-dc_new" />添加菜单</a-button>
        </template>
        <a-spin :spinning="loading">
          <a-form-item label="菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-search placeholder="请输入菜单名称搜索" allowClear @change="searchMenu" />
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
              <span v-if="item.name.indexOf(searchValue) > -1">
                {{ item.name.substr(0, item.name.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ item.name.substr(item.name.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ item.name }}</span>
            </template>
          </a-tree>
        </a-spin>
      </a-card>
      <menu-modal ref="menuModal" :menu="treeData" @ok="initMenu" />
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card title="菜单详情">
        <template slot="extra" v-if="selectedKeys.length > 0">
          <a-popconfirm title="确认要删除该菜单吗？" @confirm="del">
            <a-button type="danger"><dc-icon type="icon-dc_empty" />删除</a-button>
          </a-popconfirm>
          <a-button type="primary" @click="save" style="margin-left: 12px"><dc-icon type="icon-dc_save" />保存</a-button>
        </template>
        <a-spin :spinning="loading">
          <a-empty v-if="selectedKeys.length == 0"> <span slot="description"> 请先选择一个菜单! </span></a-empty>
          <template v-else>
            <a-form-model ref="form" :model="menuInfo" :labelCol="infoLabelCol" :wrapperCol="infoWrapperCol" :rules="rules">
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="菜单名称" prop="name">
                    <a-input v-model="menuInfo.name" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="别名" prop="alias">
                    <a-input v-model="menuInfo.alias" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="URL" prop="menuUrl">
                    <a-input v-model="menuInfo.menuUrl" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="模板URL" prop="templateUrl">
                    <a-input v-model="menuInfo.templateUrl" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="图标" prop="menuIcon">
                    <a-input v-model="menuInfo.menuIcon" placeholder="点击选择图标">
                      <a-popover :visible="iconChooseVisible" trigger="click" slot="addonAfter" placement="bottom">
                        <template slot="content">
                          <icon-popover @choose="handleIconChoose" @close="iconChooseVisible = false" :iconChooseVisible="iconChooseVisible"></icon-popover>
                        </template>
                        <a-icon type="setting" @click="iconChooseVisible = true" />
                      </a-popover>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="默认跳转地址" prop="load" :labelCol="infoLabelColForSix" :wrapperCol="infoWrapperColForSix">
                    <a-input v-model="menuInfo.load" placeholder="默认跳转地址（子菜单不建议配置）" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="在菜单中显示" prop="enableMenu" :labelCol="infoLabelColForSix" :wrapperCol="infoWrapperColForSix">
                    <a-select v-model="menuInfo.enableMenu">
                      <a-select-option :value="1">是</a-select-option>
                      <a-select-option :value="0">否</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="排序" prop="sn">
                    <a-input-number v-model="menuInfo.sn" :min="0" style="width: 50%" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
            <a-divider orientation="left"> 功能资源 </a-divider>
            <a-button type="primary" icon="plus" @click="insertSysMethods" style="margin-bottom: 16px">添加</a-button>
            <vxe-table
              border
              ref="xTable"
              align="center"
              resizable
              keep-source
              show-overflow
              :max-height="480"
              :data="sysMethods"
              :edit-rules="tableRules"
              :edit-config="{ trigger: 'click', mode: 'cell' }"
            >
              <vxe-column type="seq" width="60"></vxe-column>
              <vxe-column field="alias" title="别名" :edit-render="{ autofocus: '.ant-input' }">
                <template #edit="scope">
                  <a-input v-model="scope.row.alias"></a-input>
                </template>
              </vxe-column>
              <vxe-column field="name" title="请求方法名" :edit-render="{ autofocus: '.ant-input' }">
                <template #edit="scope">
                  <a-input v-model="scope.row.name"></a-input>
                </template>
              </vxe-column>
              <vxe-column field="requestUrl" title="请求地址" :edit-render="{ autofocus: '.ant-input' }">
                <template #edit="scope">
                  <a-input v-model="scope.row.requestUrl"></a-input>
                </template>
              </vxe-column>
              <vxe-column title="操作" width="100" show-overflow>
                <template #default="{ row }">
                  <a-popconfirm @confirm="deleteSysMethod(row)" title="确认删除该行吗？">
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </template>
              </vxe-column>
            </vxe-table>
          </template>
        </a-spin>
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
import { initMenuTree, saveMenu, delMenu, getMenu } from '@/api/system/menu'
import MenuModal from './components/menu-modal'
import IconPopover from './components/icon-popover'
export default {
  name: 'MenuList',
  components: { MenuModal, IconPopover },
  data() {
    return {
      labelCol: { style: 'width: 60px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 60px); display: inline-block;' },
      infoLabelCol: { style: 'width: 85px; display: inline-block; vertical-align: inherit;' },
      infoWrapperCol: { style: 'width: calc(100% - 85px); display: inline-block;' },
      infoLabelColForSix: { style: 'width: 120px; display: inline-block; vertical-align: inherit;' },
      infoWrapperColForSix: { style: 'width: calc(100% - 120px); display: inline-block;' },
      iconChooseVisible: false,
      searchValue: '',
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      loading: false,
      selectedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      sysMethods: [],
      menuInfo: {},
      rules: {
        name: [{ required: true, message: '请输入菜单名称' }],
        alias: [{ required: true, message: '请输入别名' }],
        menuUrl: [{ required: true, message: '请输入Url' }],
        templateUrl: [{ required: true, message: '请输入模板Url' }],
        sn: [{ required: true, message: '请输入排序' }],
        enableMenu: [{ required: true, message: '请选择在菜单中是否显示' }]
      },
      tableRules: {
        alias: [{ required: true, message: '别名不能为空' }],
        name: [{ required: true, message: '请求地址不能为空' }],
        requestUrl: [{ required: true, message: '请求地址不能为空' }]
      }
    }
  },

  created() {
    this.initMenu()
  },

  methods: {
    async insertSysMethods() {
      const $table = this.$refs.xTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      const newRecord = {}
      const { row: newRow } = await $table.insertAt(newRecord, -1)
      await $table.setActiveRow(newRow)
    },

    async deleteSysMethod(row) {
      const $table = this.$refs.xTable
      await $table.remove(row)
    },

    initMenu() {
      this.loading = true
      initMenuTree()
        .then(res => {
          if (res.state) {
            this.treeData = res.value
            this.setExpandedKeys(res.value)
          }
        })
        .finally(() => (this.loading = false))
    },

    setExpandedKeys(menu) {
      menu.forEach(m => {
        if (m.children && m.children.length > 0) {
          this.expandedKeys.push(m.id)
          this.setExpandedKeys(m.children)
        }
      })
    },

    searchMenu(e) {
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
        this.$nextTick(() => this.$refs.form.clearValidate())
        this.loading = true
        getMenu(selectedKeys[0])
          .then(res => {
            if (res.state) {
              this.menuInfo = res.value
              this.sysMethods = res.value.sysMethods
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    async save() {
      try {
        await this.$refs.form.validate()
        const $table = this.$refs.xTable
        const errMap = await $table.validate().catch(errMap => errMap)
        if (errMap) {
          return
        }
        const data = $table.getTableData()
        let param = { ...this.menuInfo, sysMethods: data.tableData }
        this.loading = true
        saveMenu(param)
          .then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.initMenu()
            } else {
              this.$message.error(res.message)
            }
          })
          .finally(() => (this.loading = false))
      } catch (error) {
        return undefined
      }
    },

    del() {
      this.loading = true
      delMenu({ id: this.selectedKeys[0] })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initMenu()
            this.selectedKeys = []
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    handleIconChoose(value) {
      this.menuInfo.menuIcon = value
      this.iconChooseVisible = false
    }
  }
}
</script>

<style scoped lang="less"></style>
