<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <a-button icon="plus-circle" type="link" @click="add(0)"> 且条件 </a-button>
      <a-button icon="plus-circle" type="link" @click="add(1)"> 或条件 </a-button>
      <div v-for="(range, index) in dataRangeVal" :key="index">
        <div v-if="range.and_or != ''" style="margin-left: 24px">
          {{ range.and_or == 'and' ? '并且' : '或者' }}
        </div>
        <div class="innerDiv">
          <div v-if="dataRangeVal.length != 1" class="iconDiv">
            <a-icon type="close-circle" @click="del(index)" />
          </div>
          <a-row v-for="(left, leftIndex) in range.left" :key="'left' + leftIndex" :gutter="12">
            <a-col :span="3">
              <span v-if="leftIndex == 0"> 公式左侧 </span>
              <dc-select
                v-else
                v-model="left.operator"
                placeholder="运算符"
                @change="val => changeLeftOpt(val, leftIndex, index)"
                :options="renderCalculateListOptions(calculateList, 'left')"
              >
              </dc-select>
            </a-col>
            <a-col :span="4">
              <dc-select
                placeholder="请选择"
                v-model="left.fieldType"
                @change="val => changeLeftType(val, leftIndex, index)"
                :options="[
                  { name: '当前表单字段', id: 'current' },
                  { name: '关联表单字段', id: 'relate' },
                  { name: '固定数值', id: 'fixed' }
                ]"
              ></dc-select>
            </a-col>
            <template v-if="left.fieldType">
              <a-col :span="4" v-if="left.fieldType == 'relate'">
                <dc-select v-model="left.formId" :options="formOptions" placeholder="请选择关联表" @change="val => changeLeftForm(val, leftIndex, index)"></dc-select>
              </a-col>
              <a-col :span="4" v-if="left.fieldType == 'fixed'">
                <a-input v-model="left.field" placeholder="请输入" @change="e => changeLeftInputField(e, leftIndex, index)" />
              </a-col>
              <template>
                <a-col :span="4" v-if="left.fieldType != 'fixed' && showLeftFields[index][leftIndex]">
                  <dc-select v-model="left.field" @change="val => changeLeftField(val, leftIndex, index)" :options="leftFields[index][leftIndex]"></dc-select>
                </a-col>
                <a-col :span="left.fieldType == 'relate' ? 4 : 8" v-if="showLeftOption[index][leftIndex]">
                  <dc-select v-model="left.value" placeholder="请选择" :options="leftOptions[index][leftIndex]" @change="val => changeLeftVal(val, leftIndex, index)"></dc-select>
                </a-col>
              </template>
            </template>
            <a-col :span="2">
              <div class="rowIcon" v-if="leftIndex == 0">
                <a-icon type="plus-circle" @click="addLeft(index)" />
              </div>
              <div v-else class="rowIconDel">
                <a-icon type="minus-circle" @click="delLeft(leftIndex, index)" />
              </div>
            </a-col>
          </a-row>

          <a-row :gutter="12">
            <a-col :span="3">判断符</a-col>
            <a-col :span="8">
              <dc-select placeholder="请选择" v-model="range.operator" @change="val => changeOpt(val, index)" :options="operatorList" :fields="{}"></dc-select>
            </a-col>
          </a-row>

          <a-row v-for="(right, rightIndex) in range.right" :key="'right' + rightIndex" :gutter="12">
            <a-col :span="3">
              <span v-if="rightIndex == 0"> 公式右侧 </span>
              <dc-select
                v-else
                v-model="right.operator"
                placeholder="运算符"
                @change="val => changeRightOpt(val, rightIndex, index)"
                :options="renderCalculateListOptions(calculateList, 'right')"
              >
              </dc-select>
            </a-col>
            <a-col :span="4">
              <dc-select
                placeholder="请选择"
                v-model="right.fieldType"
                @change="val => changeRightType(val, rightIndex, index)"
                :options="[
                  { name: '当前表单字段', id: 'current' },
                  { name: '关联表单字段', id: 'relate' },
                  { name: '固定数值', id: 'fixed' }
                ]"
              ></dc-select>
            </a-col>
            <template v-if="right.fieldType">
              <a-col :span="4" v-if="right.fieldType == 'relate'">
                <dc-select v-model="right.formId" :options="formOptions" placeholder="请选择关联表" @change="val => changeRightForm(val, rightIndex, index)"></dc-select>
              </a-col>
              <a-col :span="4" v-if="right.fieldType == 'fixed'">
                <a-input v-model="right.field" placeholder="请输入" @change="e => changeRightInputField(e, rightIndex, index)" />
              </a-col>
              <template>
                <a-col :span="4" v-if="right.fieldType != 'fixed' && showRightFields[index][rightIndex]">
                  <dc-select v-model="right.field" @change="val => changeRightField(val, rightIndex, index)" :options="rightFields[index][rightIndex]"></dc-select>
                </a-col>
                <a-col :span="right.fieldType == 'relate' ? 4 : 8" v-if="showRightOption[index][rightIndex]">
                  <dc-select
                    v-model="right.value"
                    placeholder="请选择"
                    :options="rightOptions[index][rightIndex]"
                    @change="val => changeRightVal(val, rightIndex, index)"
                  ></dc-select>
                </a-col>
              </template>
            </template>
            <a-col :span="2">
              <div class="rowIcon" v-if="rightIndex == 0">
                <a-icon type="plus-circle" @click="addRight(index)" />
              </div>
              <div v-else class="rowIconDel">
                <a-icon type="minus-circle" @click="delRight(rightIndex, index)" />
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TEMP_FORM } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'RuleDatarange',
  props: ['value', 'drawingList'],
  data() {
    return {
      dataRangeVal: JSON.parse(JSON.stringify(this.value)),
      operatorList: ['<', '<=', '=', '>=', '>', '!='],
      calculateList: ['+', '-', '*', '/'],
      showLeftOption: [[]],
      showRightOption: [[]],
      leftOptions: [[]],
      rightOptions: [[]],
      leftFields: [[]],
      rightFields: [[]],
      showRightFields: [[]],
      showLeftFields: [[]],
      formOptions: storage.get(TEMP_FORM)
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.dataRangeVal = JSON.parse(JSON.stringify(newVal))
        let showLeftOption = []
        let showRightOption = []
        let leftOptions = []
        let rightOptions = []
        let leftFields = []
        let rightFields = []
        let showRightFields = []
        let showLeftFields = []
        this.dataRangeVal.forEach((dr, i) => {
          showLeftOption[i] = []
          showRightOption[i] = []
          leftOptions[i] = []
          rightOptions[i] = []
          leftFields[i] = []
          rightFields[i] = []
          showRightFields[i] = []
          showLeftFields[i] = []
          let left = dr.left
          left.forEach((l, j) => {
            if (l.formId == 'current') {
              showLeftFields[i][j] = true
              leftFields[i][j] = this.renderDrawingListOption(this.drawingList)
              let item = this.drawingList.find(d => d.__vModel__ == l.field)
              if (item && item.__config__.layout === 'tableLayout') {
                leftOptions[i][j] = item.columns.map(item => {
                  let name = item.label
                  let id = item.props
                  let key = item.key
                  return { name, id, key }
                })
                showLeftOption[i][j] = true
              } else {
                leftOptions[i][j] = []
                showLeftOption[i][j] = false
              }
            } else {
              if (l.formId) {
                showLeftFields[i][j] = true
                let form = storage.get(TEMP_FORM).find(f => f.id == l.formId)
                if (form) {
                  let leftList = JSON.parse(form.componentProperties)
                  leftFields[i][j] = leftList.map(item => {
                    let name = item.__config__.label
                    let id = item.__vModel__
                    let key = item.__config__.formId
                    return { name, id, key }
                  })
                  let item = leftList.find(d => d.__vModel__ == l.field)
                  if (item && item.__config__.layout === 'tableLayout') {
                    leftOptions[i][j] = item.columns.map(item => {
                      let name = item.label
                      let id = item.props
                      let key = item.key
                      return { name, id, key }
                    })
                    showLeftOption[i][j] = true
                  } else {
                    leftOptions[i][j] = []
                    showLeftOption[i][j] = false
                  }
                } else {
                  leftFields[i][j] = []
                  leftOptions[i][j] = []
                  showLeftOption[i][j] = false
                }
              } else {
                showLeftFields[i][j] = false
                leftFields[i][j] = []
                leftOptions[i][j] = []
                showLeftOption[i][j] = false
              }
            }
          })
          let right = dr.right
          right.forEach((r, j) => {
            if (r.formId == 'current') {
              showRightFields[i][j] = true
              rightFields[i][j] = this.renderDrawingListOption(this.drawingList)
              let item = this.drawingList.find(d => d.__vModel__ == r.field)
              if (item && item.__config__.layout === 'tableLayout') {
                rightOptions[i][j] = item.columns.map(item => {
                  let name = item.label
                  let id = item.props
                  let key = item.key
                  return { name, id, key }
                })
                showRightOption[i][j] = true
              } else {
                rightOptions[i][j] = []
                showRightOption[i][j] = false
              }
            } else {
              if (r.formId) {
                showRightFields[i][j] = true
                let form = storage.get(TEMP_FORM).find(f => f.id == r.formId)
                if (form) {
                  let rightList = JSON.parse(form.componentProperties)
                  rightFields[i][j] = rightList.map(item => {
                    let name = item.__config__.label
                    let id = item.__vModel__
                    let key = item.__config__.formId
                    return { name, id, key }
                  })
                  let item = rightList.find(d => d.__vModel__ == r.field)
                  if (item && item.__config__.layout === 'tableLayout') {
                    rightOptions[i][j] = item.columns.map(item => {
                      let name = item.label
                      let id = item.props
                      let key = item.key
                      return { name, id, key }
                    })
                    showRightOption[i][j] = true
                  } else {
                    rightOptions[i][j] = []
                    showRightOption[i][j] = false
                  }
                } else {
                  rightFields[i][j] = []
                  rightOptions[i][j] = []
                  showRightOption[i][j] = false
                }
              } else {
                rightFields[i][j] = []
                rightOptions[i][j] = []
                showRightOption[i][j] = false
                showRightFields[i][j] = false
              }
            }
          })
        })
        this.showLeftOption = showLeftOption
        this.showRightOption = showRightOption
        this.leftOptions = leftOptions
        this.rightOptions = rightOptions
        this.leftFields = leftFields
        this.rightFields = rightFields
        this.showRightFields = showRightFields
        this.showLeftFields = showLeftFields
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
    renderCalculateListOptions(calculateList, title) {
      return calculateList.map(item => {
        let name = item
        let id = item
        let key = title + 'item'
        return { name, id, key }
      })
    },
    del(index) {
      this.dataRangeVal.splice(index, 1)
      this.dataRangeVal[0].and_or = ''
      this.showLeftOption.splice(index, 1)
      this.showRightOption.splice(index, 1)
      this.leftOptions.splice(index, 1)
      this.rightOptions.splice(index, 1)
      this.showLeftFields.splice(index, 1)
      this.showRightFields.slice(index, 1)
      this.leftFields.splice(index, 1)
      this.rightFields.splice(index, 1)
      this.$emit('input', this.dataRangeVal)
    },

    add(andOr) {
      let range = {
        left: [{ operator: '', type: '', value: '', field: '', formId: '' }],
        operator: '',
        right: [{ operator: '', type: '', value: '', field: '', formId: '' }],
        and_or: andOr == 0 ? 'and' : 'or'
      }
      this.dataRangeVal.push(range)
      this.showLeftOption.push([])
      this.showRightOption.push([])
      this.leftOptions.push([])
      this.rightOptions.push([])
      this.showLeftFields.push([])
      this.showRightFields.push([])
      this.leftFields.push([])
      this.rightFields.push([])
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftType(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].fieldType = val
      this.dataRangeVal[index].left[leftIndex].type = val === 'fixed' ? 'fixed' : 'field'
      this.dataRangeVal[index].left[leftIndex].field = ''
      this.dataRangeVal[index].left[leftIndex].value = ''
      if (val === 'current') {
        this.dataRangeVal[index].left[leftIndex].formId = 'current'
        this.showLeftFields[index][leftIndex] = true
        this.leftFields[index][leftIndex] = this.renderDrawingListOption(this.drawingList)
      } else {
        this.dataRangeVal[index].left[leftIndex].formId = ''
        this.showLeftFields[index][leftIndex] = false
        this.leftFields[index][leftIndex] = []
      }
      this.showLeftOption[index][leftIndex] = false
      this.$emit('input', this.dataRangeVal)
    },
    changeRightType(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].fieldType = val
      this.dataRangeVal[index].right[rightIndex].type = val === 'fixed' ? 'fixed' : 'field'
      this.dataRangeVal[index].right[rightIndex].field = ''
      this.dataRangeVal[index].right[rightIndex].value = ''
      if (val === 'current') {
        this.dataRangeVal[index].right[rightIndex].formId = 'current'
        this.showRightFields[index][rightIndex] = true
        this.rightFields[index][rightIndex] = this.renderDrawingListOption(this.drawingList)
      } else {
        this.dataRangeVal[index].right[rightIndex].formId = ''
        this.showRightFields[index][rightIndex] = false
        this.rightFields[index][rightIndex] = []
      }
      this.showRightOption[index][rightIndex] = false
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftInputField(e, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].field = e.target.value
      this.$emit('input', this.dataRangeVal)
    },

    changeRightInputField(e, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].field = e.target.value
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftField(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].field = val
      let form = storage.get(TEMP_FORM).find(f => f.id == this.dataRangeVal[index].left[leftIndex].formId)
      let item
      if (form) {
        item = JSON.parse(form.componentProperties).find(item => item.__vModel__ == val)
      } else {
        item = this.drawingList.find(item => item.__vModel__ == val)
      }
      this.dataRangeVal[index].left[leftIndex].value = ''
      if (val && item.__config__.layout === 'tableLayout') {
        this.showLeftOption[index][leftIndex] = true
        this.leftOptions[index][leftIndex] = item.columns.map(item => {
          let name = item.label
          let id = item.props
          let key = item.key
          return { name, id, key }
        })
      } else {
        this.showLeftOption[index][leftIndex] = false
        this.leftOptions[index][leftIndex] = []
      }
      this.$forceUpdate()
      this.$emit('input', this.dataRangeVal)
    },

    changeRightField(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].field = val
      let form = storage.get(TEMP_FORM).find(f => f.id == this.dataRangeVal[index].right[rightIndex].formId)
      let item
      if (form) {
        item = JSON.parse(form.componentProperties).find(item => item.__vModel__ == val)
      } else {
        item = this.drawingList.find(item => item.__vModel__ == val)
      }
      this.dataRangeVal[index].right[rightIndex].value = ''
      if (val && item.__config__.layout === 'tableLayout') {
        this.showRightOption[index][rightIndex] = true
        this.rightOptions[index][rightIndex] = item.columns.map(item => {
          let name = item.label
          let id = item.props
          let key = item.key
          return { name, id, key }
        })
      } else {
        this.showRightOption[index][rightIndex] = false
        this.rightOptions[index][rightIndex] = []
      }
      this.$forceUpdate()
      this.$emit('input', this.dataRangeVal)
    },

    changeRightOpt(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].operator = val
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftOpt(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].operator = val
      this.$emit('input', this.dataRangeVal)
    },
    changeOpt(val, index) {
      this.dataRangeVal[index].operator = val
      this.$emit('input', this.dataRangeVal)
    },

    addLeft(index) {
      let left = { operator: '', type: '', value: '', formId: '' }
      this.dataRangeVal[index].left.push(left)
      this.showLeftOption[index].push(false)
      this.leftOptions[index].push([])
      this.leftFields[index].push([])
      this.showLeftFields[index].push(false)
      this.$emit('input', this.dataRangeVal)
    },

    addRight(index) {
      let right = { operator: '', type: '', value: '', formId: '' }
      this.dataRangeVal[index].right.push(right)
      this.showRightOption[index].push(false)
      this.rightOptions[index].push([])
      this.rightFields[index].push([])
      this.showRightFields[index].push(false)
      this.$emit('input', this.dataRangeVal)
    },

    delLeft(leftIndex, index) {
      this.dataRangeVal[index].left.splice(leftIndex, 1)
      this.showLeftOption[index].splice(leftIndex, 1)
      this.leftOptions[index].splice(leftIndex, 1)
      this.$emit('input', this.dataRangeVal)
    },

    delRight(rightIndex, index) {
      this.dataRangeVal[index].right.splice(rightIndex, 1)
      this.showRightOption[index].splice(rightIndex, 1)
      this.rightOptions[index].splice(rightIndex, 1)
      this.$emit('input', this.dataRangeVal)
    },

    changeRightForm(val, rightIndex, index) {
      this.showRightOption[index][rightIndex] = false
      this.dataRangeVal[index].right[rightIndex].formId = val
      this.dataRangeVal[index].right[rightIndex].field = ''
      this.dataRangeVal[index].right[rightIndex].value = ''
      if (val) {
        let form = storage.get(TEMP_FORM).find(f => f.id == val)
        let options = JSON.parse(form.componentProperties).map(item => {
          let name = item.__config__.label
          let id = item.__vModel__
          let key = item.__config__.formId
          return { name, id, key }
        })
        this.showRightFields[index][rightIndex] = true
        this.rightFields[index][rightIndex] = options
      } else {
        this.showRightFields[index][rightIndex] = false
        this.rightFields[index][rightIndex] = []
      }
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftForm(val, leftIndex, index) {
      this.showLeftOption[index][leftIndex] = false
      this.dataRangeVal[index].left[leftIndex].formId = val
      this.dataRangeVal[index].left[leftIndex].field = ''
      this.dataRangeVal[index].left[leftIndex].value = ''
      if (val) {
        let form = storage.get(TEMP_FORM).find(f => f.id == val)
        let options = JSON.parse(form.componentProperties).map(item => {
          let name = item.__config__.label
          let id = item.__vModel__
          let key = item.__config__.formId
          return { name, id, key }
        })
        this.showLeftFields[index][leftIndex] = true
        this.leftFields[index][leftIndex] = options
      } else {
        this.showLeftFields[index][leftIndex] = false
        this.leftFields[index][leftIndex] = []
      }
      this.$emit('input', this.dataRangeVal)
    },
    changeRightVal(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].value = val
      this.$emit('input', this.dataRangeVal)
    },
    changeLeftVal(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].value = val
      this.$emit('input', this.dataRangeVal)
    },
    validate() {
      let flag = true
      outer: for (let i = 0; i < this.dataRangeVal.length; i++) {
        if (this.dataRangeVal[i].operator == '') {
          flag = false
          break
        }
        for (let j = 0; j < this.dataRangeVal[i].left.length; j++) {
          if (this.dataRangeVal[i].left[j].type == '' || this.dataRangeVal[i].left[j].field == '') {
            flag = false
            break outer
          }
          if (j != 0 && this.dataRangeVal[i].left[j].operator == '') {
            flag = false
            break outer
          }
        }
        for (let j = 0; j < this.dataRangeVal[i].right.length; j++) {
          if (this.dataRangeVal[i].right[j].type == '' || this.dataRangeVal[i].right[j].field == '') {
            flag = false
            break outer
          }
          if (j != 0 && this.dataRangeVal[i].right[j].operator == '') {
            flag = false
            break outer
          }
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined)
        } else {
          resolve('数据范围校验组合中不能为空！')
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
