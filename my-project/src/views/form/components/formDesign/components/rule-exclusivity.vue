<template>
  <div class="typeDiv">
    <div class="innerDiv">
      <a-row v-for="(left, leftIndex) in exclusiveVal[0].left" :key="'left' + leftIndex" :gutter="12">
        <a-col :span="4">
          <span v-if="leftIndex == 0"> 当前表字段 </span>
        </a-col>
        <a-col :span="8">
          <dc-select
            placeholder="请选择当前表字段"
            v-model="left.field"
            :options="renderDrawingListOption(drawingList)"
            @change="val => changeLeftField(val, leftIndex)"
          ></dc-select>
        </a-col>
        <a-col :span="8" v-if="showLeftOption[leftIndex]">
          <dc-select v-model="left.value" placeholder="请选择" :options="leftOptions[leftIndex]" @change="val => changeLeftValue(val, leftIndex)"></dc-select>
        </a-col>
        <a-col :span="1">
          <div class="rowIcon" v-if="leftIndex == 0">
            <a-icon type="plus-circle" @click="addLeft" />
          </div>
          <div v-else class="rowIconDel">
            <a-icon type="minus-circle" @click="delLeft(leftIndex)" />
          </div>
        </a-col>
      </a-row>
      <a-row v-for="(right, rightIndex) in exclusiveVal[0].right" :key="'right' + rightIndex" :gutter="12">
        <a-col :span="4">
          <span v-if="rightIndex == 0"> 与关联表 </span>
        </a-col>
        <a-col :span="5">
          <dc-select v-model="right.formId" :options="formOptions" placeholder="请选择关联表" @change="val => changeForm(val, rightIndex)"></dc-select>
        </a-col>
        <a-col :span="6">
          <dc-select v-model="right.field" @change="val => changeRightField(val, rightIndex)" :options="rightFieldOptions[rightIndex]" placeholder="请选择关联表字段"></dc-select>
        </a-col>
        <a-col :span="5" v-if="showRightOption[rightIndex]">
          <dc-select v-model="right.value" :options="rightOptions[rightIndex]" placeholder="请选择" @change="val => changeRightValue(val, rightIndex)"></dc-select>
        </a-col>
        <a-col :span="2">
          <div class="rowIcon" v-if="rightIndex == 0">
            <a-icon type="plus-circle" @click="addRight" />
          </div>
          <div v-else class="rowIconDel">
            <a-icon type="minus-circle" @click="delRight(rightIndex)" />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { TEMP_FORM } from '@/store/mutation-types'
import storage from 'store'
//排他性校验
export default {
  name: 'RuleExclusivity',
  props: ['value', 'drawingList'],
  data() {
    return {
      exclusiveVal: JSON.parse(JSON.stringify(this.value)),
      showLeftOption: [],
      leftOptions: [],
      rightFieldOptions: [],
      showRightOption: [],
      rightOptions: [],
      formOptions: storage.get(TEMP_FORM)
    }
  },

  watch: {
    value: {
      handler(newVal) {
        this.exclusiveVal = JSON.parse(JSON.stringify(newVal))
        let left = this.exclusiveVal[0].left
        let right = this.exclusiveVal[0].right
        left.forEach((l, i) => {
          let item = this.drawingList.find(d => d.__vModel__ == l.field)
          if (item && item.__config__.layout === 'tableLayout') {
            this.showLeftOption[i] = true
            this.leftOptions[i] = item.columns.map(item => {
              let name = item.label
              let id = item.props
              let key = item.key
              return { name, id, key }
            })
          } else {
            this.showLeftOption[i] = false
            this.leftOptions[i] = []
          }
        })
        right.forEach((r, j) => {
          let form = storage.get(TEMP_FORM).find(f => f.id == r.formId)
          if (form) {
            let rightList = JSON.parse(form.componentProperties)
            this.rightFieldOptions[j] = rightList.map(item => {
              let name = item.__config__.label
              let id = item.__vModel__
              let key = item.__config__.formId
              return { name, id, key }
            })
            let item = rightList.find(d => d.__vModel__ == r.field)
            if (item && item.__config__.layout === 'tableLayout') {
              this.rightOptions[j] = item.columns.map(item => {
                let name = item.label
                let id = item.props
                let key = item.key
                return { name, id, key }
              })
              this.showRightOption[j] = true
            } else {
              this.rightOptions[j] = []
              this.showRightOption[j] = false
            }
          } else {
            this.rightFieldOptions[j] = []
            this.rightOptions[j] = []
            this.showRightOption[j] = false
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    renderDrawingListOption(drawingList) {
      return drawingList.map(item => {
        let name = item.__config__.label
        let id = item.__vModel__
        let key = item.__config__.formId
        return { name, id, key }
      })
    },

    changeLeftField(val, leftIndex) {
      this.exclusiveVal[0].left[leftIndex].field = val
      this.exclusiveVal[0].left[leftIndex].value = ''
      let item = this.drawingList.find(item => item.__vModel__ == val)
      if (val && item.__config__.layout === 'tableLayout') {
        this.showLeftOption[leftIndex] = true
        this.leftOptions[leftIndex] = item.columns.map(item => {
          let name = item.label
          let id = item.props
          let key = item.key
          return { name, id, key }
        })
      } else {
        this.showLeftOption[leftIndex] = false
        this.leftOptions[leftIndex] = []
      }
      this.$emit('input', this.exclusiveVal)
    },
    addLeft() {
      let left = { operator: '', type: 'field', value: '', field: '', formId: 'current' }
      this.exclusiveVal[0].left.push(left)
      this.showLeftOption.push(false)
      this.leftOptions.push([])
      this.$emit('input', this.exclusiveVal)
    },
    delLeft(leftIndex) {
      this.exclusiveVal[0].left.splice(leftIndex, 1)
      this.showLeftOption.splice(leftIndex, 1)
      this.leftOptions.splice(leftIndex, 1)
      this.$emit('input', this.exclusiveVal)
    },
    changeForm(val, rightIndex) {
      this.exclusiveVal[0].right[rightIndex].formId = val
      this.exclusiveVal[0].right[rightIndex].field = ''
      this.exclusiveVal[0].right[rightIndex].value = ''
      if (val) {
        let form = storage.get(TEMP_FORM).find(f => f.id == val)
        let options = JSON.parse(form.componentProperties).map(item => {
          let name = item.__config__.label
          let id = item.__vModel__
          let key = item.__config__.formId
          return { name, id, key }
        })
        this.rightFieldOptions[rightIndex] = options
      } else {
        this.rightFieldOptions[rightIndex] = []
      }
      this.rightOptions[rightIndex] = []
      this.showRightOption[rightIndex] = false
      this.$emit('input', this.exclusiveVal)
    },
    addRight() {
      let right = { operator: '', type: 'field', value: '', field: '', formId: '' }
      this.exclusiveVal[0].right.push(right)
      this.showRightOption.push(false)
      this.rightOptions.push([])
      this.$emit('input', this.exclusiveVal)
    },
    delRight(rightIndex) {
      this.exclusiveVal[0].right.splice(rightIndex, 1)
      this.showLeftOption.splice(rightIndex, 1)
      this.leftOptions.splice(rightIndex, 1)
      this.$emit('input', this.exclusiveVal)
    },
    changeRightField(val, rightIndex) {
      this.exclusiveVal[0].right[rightIndex].field = val
      this.exclusiveVal[0].right[rightIndex].value = ''
      let form = storage.get(TEMP_FORM).find(f => f.id == this.exclusiveVal[0].right[rightIndex].formId)
      let item = JSON.parse(form.componentProperties).find(item => item.__vModel__ == val)
      if (val && item.__config__.layout === 'tableLayout') {
        this.showRightOption[rightIndex] = true
        this.rightOptions[rightIndex] = item.columns.map(item => {
          let name = item.label
          let id = item.props
          let key = item.key
          return { name, id, key }
        })
      } else {
        this.showRightOption[rightIndex] = false
        this.rightOptions[rightIndex] = []
      }
      this.$emit('input', this.exclusiveVal)
    },
    changeLeftValue(val, leftIndex) {
      this.exclusiveVal[0].left[leftIndex].value = val
      this.$emit('input', this.exclusiveVal)
    },
    changeRightValue(val, rightIndex) {
      this.exclusiveVal[0].right[rightIndex].value = val
      this.$emit('input', this.exclusiveVal)
    },
    validate() {
      let flag = true
      for (let j = 0; j < this.exclusiveVal[0].left.length; j++) {
        if (this.exclusiveVal[0].left[j].field == '') {
          flag = false
          break
        } else {
          let item = this.drawingList.find(item => item.__vModel__ == this.exclusiveVal[0].left[j].field)
          if (item && item.__config__.layout === 'tableLayout' && this.exclusiveVal[0].left[j].value == '') {
            flag = false
            break
          }
        }
      }
      for (let j = 0; j < this.exclusiveVal[0].right.length; j++) {
        if (this.exclusiveVal[0].right[j].field == '' || this.exclusiveVal[0].right[j].formId == '') {
          flag = false
          break
        } else if (this.exclusiveVal[0].right[j].field != '') {
          let item = this.drawingList.find(item => item.__vModel__ == this.exclusiveVal[0].right[j].field)
          if (item && item.__config__.layout === 'tableLayout' && this.exclusiveVal[0].right[j].value == '') {
            flag = false
            break
          }
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined)
        } else {
          resolve('排他性校验组合中不能为空！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.typeDiv {
  background-color: #f5f8fd;
  min-height: 200px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  padding-top: 12px;
  padding-bottom: 24px;
  .buttonDiv {
    margin: 0px 0px 12px 12px;
  }
  /deep/ .ant-row {
    margin-bottom: 8px;
  }
  /deep/ .ant-col {
    margin-right: 8px;
  }
  .innerDiv {
    margin: 12px;
    padding: 12px 12px 0px 12px;
    border: 1px dashed #abcaf9;
    border-radius: 5px;
    .iconDiv {
      position: relative;
      z-index: 11;
      float: right;
      cursor: pointer;
      margin-top: -8px;
      font-size: 18px;
      color: #f56c6c;
    }
    .rowIcon {
      font-size: 16px;
      color: #2f68bd;
      cursor: pointer;
    }
    .rowIconDel {
      font-size: 16px;
      color: #f56c6c;
      cursor: pointer;
    }
  }
}
</style>
