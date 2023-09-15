<template>
  <dc-dialog :visible.sync="visible" title="配置表单大类" width="35%" :disabled="loading" @closed="categoryForm = { dataSource: [] }" @confirm="handleSubmit">
    <div class="form-div">
      <el-form ref="categoryForm" :model="categoryForm" label-width="80px" size="small" :rules="rules">
        <el-form-item prop="name" label="所属合集">
          <el-input v-model="categoryForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item prop="type" label="合集类型">
          <el-input v-model="categoryForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item prop="year" label="年份">
          <el-input v-model="categoryForm.year" :disabled="true" />
        </el-form-item>
      </el-form>

      <dc-vxe-table
        ref="vTable"
        bordered
        toolbar
        rowNumber
        drag-sort
        keep-source
        :max-height="380"
        :loading="submitLoading"
        :dataSource="categoryForm.dataSource"
        :columns="columns"
        style="margin-top: 8px"
        @sort="handelSort"
      >
        <template v-slot:action="props">
          <el-popconfirm title="确认删除吗?" @confirm="handelDL(props)">
            <a slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </dc-vxe-table>
    </div>
  </dc-dialog>
</template>

<script>
import { DCVXETypes } from '@/components/DCVxeTable'
import { getFormCategories, saveFormCategories } from '@/api/form'
export default {
  name: 'UpdateFormCategory',
  data() {
    return {
      submitLoading: false,
      loading: false,
      visible: false,
      columns: [
        {
          title: '表单大类名称',
          key: 'name',
          type: DCVXETypes.input,
          align: 'center',
          validateRules: [
            {
              required: true,
              message: '请输入${title}'
            },
            {
              unique: true,
              message: '${title}不能重复'
            }
          ]
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '100',
          type: DCVXETypes.slot,
          slotName: 'action'
        }
      ],
      categoryForm: {
        dataSource: []
      },
      rules: {
        name: [{ required: true, message: '请输入合集名称' }],
        type: [{ required: true, message: '请选择合集类型' }],
        year: [{ required: true, message: '请选择年份' }]
      }
    }
  },

  methods: {
    handelDL(props) {
      props.target.removeRows(props.row)
    },

    handelSort(data) {
      this.categoryForm.dataSource = []
      this.$nextTick(() => (this.categoryForm.dataSource = data))
    },

    show(formCategory) {
      this.categoryForm = { ...formCategory, ...this.categoryForm }
      this.loadFormCategory()
      this.visible = true
    },

    loadFormCategory() {
      const param = { id: this.categoryForm.id, pageBean: {} }
      this.loading = true
      getFormCategories(param)
        .then(res => {
          if (res.state) {
            this.categoryForm.dataSource = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    handleSubmit() {
      this.$refs.vTable.validateTable().then(errMap => {
        if (!errMap) {
          let param = {
            formCollectionId: this.categoryForm.id,
            categories: this.$refs.vTable.getTableData()
          }
          saveFormCategories(param)
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

<style lang="scss" scoped>
.form-div {
  margin: 0 24px;
}
</style>
