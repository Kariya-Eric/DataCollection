<template>
  <a-modal :title="updateFlag ? '添加显隐规则' : '修改显隐规则'" width="40%" :visible.sync="visible" v-if="visible" @cancel="close" @ok="handleSubmit">
    <a-form-model ref="logicForm" :model="logicForm" :rules="rules">
      <a-form-model-item prop="andOr">
        当满足以下<a-select v-model="logicForm.andOr" class="andOr">
          <a-select-option value="&&">全部</a-select-option>
          <a-select-option value="||">任意</a-select-option>
        </a-select>
        条件时
      </a-form-model-item>
      <a-button style="margin-bottom: 8px" icon="plus-circle" type="link" @click="addTerm"> 添加条件 </a-button>
      <a-form-model-item v-for="(item, index) in logicForm.termList" :key="index" :prop="'termList.' + index" :rules="rules.termList">
        <div class="termRow">
          <logic-item :drawing-list="drawingList" v-model="logicForm.termList[index]" />
          <i v-if="logicForm.termList.length > 1" class="el-icon-delete" @click="delTerm(index)"></i>
        </div>
      </a-form-model-item>
      <a-form-model-item label="显示以下字段" prop="showList">
        <a-select v-model="logicForm.showList" style="width: 100%" multiple>
          <a-select-option v-for="(item, index) in showOptions" :key="index" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import LogicItem from './logic-item'

export default {
  name: 'LogicDialog',
  props: ['drawingList', 'formConf'],
  components: { LogicItem },
  computed: {
    showOptions() {
      return this.drawingList.map(item => {
        let value = item.__config__.formId
        if (item.__config__.tag == '"formDivider"') {
          return { label: item.title, value }
        }
        return { label: item.__config__.label, value }
      })
    }
  },
  data() {
    return {
      visible: false,
      updateFlag: false,
      index: 0,
      logicForm: {
        andOr: '',
        termList: [{ term: '', calFlag: '', termVal: '' }],
        showList: []
      },
      rules: {
        andOr: [{ required: true, message: '请选择条件' }],
        showList: [{ required: true, message: '请至少选择一条' }],
        termList: [
          {
            validator: (rule, value, callback) => {
              if (value.term == '' || value.calFlag == '') {
                callback(new Error('请正确构建条件！'))
              }
              if (value.termVal instanceof Array && value.termVal.length == 0) {
                callback(new Error('请正确构建条件！'))
              } else if (value.termVal === '') {
                callback(new Error('请正确构建条件！'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  methods: {
    show(index) {
      if (index != undefined) {
        this.logicForm = JSON.parse(JSON.stringify(this.formConf.componentsVisible[index]))
        this.index = index
        this.updateFlag = true
      } else {
        this.updateFlag = false
      }
      this.visible = true
    },

    close() {
      this.$refs.logicForm.resetFields()
      this.logicForm = {
        andOr: '',
        termList: [{ term: '', calFlag: '', termVal: '' }],
        showList: []
      }
    },

    handleSubmit() {
      for (let i = 0; i < this.logicForm.showList.length; i++) {
        let show = this.logicForm.showList[i]
        if (this.logicForm.termList.map(term => term.term).includes(show)) {
          this.$message.warning('条件字段中请不要包含显示字段！')
          return
        }
      }
      this.$refs.logicForm.validate(valid => {
        if (valid) {
          let logic = JSON.parse(JSON.stringify(this.logicForm))
          if (this.updateFlag) {
            this.formConf.componentsVisible[this.index] = logic
          } else {
            this.formConf.componentsVisible.push(logic)
          }
          this.visible = false
        }
      })
    },

    delTerm(index) {
      this.logicForm.termList = this.logicForm.termList.filter((item, i) => i != index)
    },

    addTerm() {
      this.logicForm.termList.push({ term: '', calFlag: '', termVal: '' })
    }
  }
}
</script>

<style lang="less" scoped>
.andOr {
  margin-left: 12px;
  margin-right: 12px;
}
.termRow {
  i {
    cursor: pointer;
    float: right;
    margin: -24px 4px;
  }
}
</style>
