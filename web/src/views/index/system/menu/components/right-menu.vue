<template>
  <div>
    <el-form ref="baseForm" size="small" label-width="100px" v-loading="loading" :model="menuDetail" :rules="baseRule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="menuDetail.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名" prop="alias">
            <el-input v-model="menuDetail.alias" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="URL" prop="menuUrl">
            <el-input v-model="menuDetail.menuUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板URL" prop="templateUrl">
            <el-input v-model="menuDetail.templateUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标">
            <el-input v-model="menuDetail.menuIcon" style="width: 40%" @focus="showIcon">
              <el-button slot="append" icon="el-icon-setting" @click="showIcon" />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sn">
            <el-input-number v-model="menuDetail.sn" style="width: 40%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="在菜单中显示" prop="enableMenu">
          <el-select style="width: 30%" v-model="menuDetail.enableMenu">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <el-divider />
    <el-row style="margin-bottom: 8px"
      ><span style="margin-left: 12px">功能资源</span
      ><el-button size="small" type="primary" icon="el-icon-plus" style="margin-left: 24px" @click="insertSysMethods">添加</el-button></el-row
    >
    <vxe-table
      border
      ref="xTable"
      align="center"
      size="medium"
      resizable
      keep-source
      show-overflow
      :data="menuDetail.sysMethods"
      :edit-rules="tableRules"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="alias" title="别名" :edit-render="{ autofocus: '.el-input__inner' }">
        <template #edit="scope">
          <el-input v-model="scope.row.alias"></el-input>
        </template>
      </vxe-column>
      <vxe-column field="name" title="请求方法名" :edit-render="{ autofocus: '.el-input__inner' }">
        <template #edit="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </vxe-column>
      <vxe-column field="requestUrl" title="请求地址" :edit-render="{ autofocus: '.el-input__inner' }">
        <template #edit="scope">
          <el-input v-model="scope.row.requestUrl"></el-input>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="100" show-overflow>
        <template #default="{ row }">
          <el-popconfirm @confirm="deleteSysMethod(row)" title="确认删除该行吗？">
            <a href="javascript:;" slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <icon-dialog ref="iconDialog" @choose="chooseIcon" />
  </div>
</template>

<script>
import { getMenu } from '@/api/system'
import IconDialog from './icon-dialog.vue'

export default {
  components: { IconDialog },
  name: 'RightMenu',
  data() {
    return {
      loading: false,
      menuDetail: {
        menuIcon: ''
      },
      baseRule: {
        name: [{ required: true, message: '菜单名称不能为空' }],
        alias: [{ required: true, message: '别名不能为空' }],
        menuUrl: [{ required: true, message: 'Url不能为空' }],
        templateUrl: [{ required: true, message: '模板Url不能为空' }],
        sn: [{ required: true, message: '排序不能为空' }]
      },
      tableRules: {
        alias: [{ required: true, message: '别名不能为空' }],
        name: [{ required: true, message: '请求地址不能为空' }],
        requestUrl: [{ required: true, message: '请求地址不能为空' }]
      }
    }
  },
  methods: {
    show(id) {
      this.loading = true
      this.$refs.baseForm.resetFields()
      getMenu(id)
        .then(res => {
          if (res.state) {
            this.menuDetail = res.value
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

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

    async updateMenu() {
      try {
        await this.$refs.baseForm.validate()
        const $table = this.$refs.xTable
        const errMap = await $table.validate().catch(errMap => errMap)
        if (errMap) {
          return undefined
        }
        const data = $table.getTableData()
        this.menuDetail.sysMethods = data.tableData
        return this.menuDetail
      } catch (error) {
        return undefined
      }
    },

    showIcon() {
      this.$refs.iconDialog.show()
    },

    chooseIcon(icon) {
      this.menuDetail.menuIcon = icon
    }
  }
}
</script>

<style lang="scss" scoped>
.innerFormItem {
  margin-bottom: 16px;
}
</style>
