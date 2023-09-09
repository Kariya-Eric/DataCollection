<template>
  <dc-dialog title="添加菜单" @close="$refs.menuForm.resetFields()" width="35%" :visible.sync="visible" :disabled="loading" @confirm="handleSubmit">
    <el-form ref="menuForm" :model="menuForm" label-width="110px" :rules="rule" size="small" v-loading="loading">
      <el-form-item label="菜单名称" prop="name"><el-input v-model="menuForm.name" /></el-form-item>
      <el-form-item label="父级菜单" v-if="menuForm.parentId != undefined" prop="parentId">
        <select-tree :options="menuList" :value="menuForm.parentId" @getValue="getSelectedValue" style="width: 100%" />
      </el-form-item>
      <el-form-item label="别名" prop="alias"><el-input v-model="menuForm.alias" /></el-form-item>
      <el-form-item label="URL" prop="menuUrl"><el-input v-model="menuForm.menuUrl" /></el-form-item>
      <el-form-item label="模板URL" prop="templateUrl"><el-input v-model="menuForm.templateUrl" /></el-form-item>
      <!-- <el-form-item label="图标"></el-form-item> -->
      <el-form-item label="排序" prop="sn">
        <el-input-number v-model="menuForm.sn" />
      </el-form-item>
      <el-form-item label="在菜单中显示" prop="enableMenu">
        <el-switch v-model="menuForm.enableMenu" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
  </dc-dialog>
</template>

<script>
import { saveMenu } from '@/api/system'
export default {
  name: 'AddMenuDialog',
  data() {
    return {
      visible: false,
      loading: false,
      menuProps: {
        children: 'children',
        label: 'name'
      },
      menuList: [],
      menuForm: {},
      rule: {
        name: [{ required: true, message: '菜单名称不能为空' }],
        alias: [{ required: true, message: '别名不能为空' }],
        menuUrl: [{ required: true, message: 'Url不能为空' }],
        templateUrl: [{ required: true, message: '模板Url不能为空' }],
        sn: [{ required: true, message: '排序不能为空' }],
        enableMenu: [{ required: true, message: '请选择是否在菜单中显示' }],
        parentId: [
          {
            validator: (rule, value, callback) => {
              if (this.menuForm.parentId == undefined || this.menuForm.parentId == '') {
                callback(new Error('请选择父级菜单'))
              }
              callback()
            },
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },

  methods: {
    show(info, menuList) {
      if (info) {
        this.menuForm.parentId = info.id
        this.menuList = menuList
      } else {
        this.menuForm.enableMenu = 1
      }
      this.menuForm = Object.assign({}, this.menuForm)
      this.$nextTick(() => this.$refs.menuForm.clearValidate())
      this.visible = true
    },

    getSelectedValue(val) {
      this.menuForm.parentId = val
    },

    handleSubmit() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveMenu(this.menuForm)
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.visible = false
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
