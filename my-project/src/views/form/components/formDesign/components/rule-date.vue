<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <a-button icon="plus-circle" type="link" @click="add(0)"> 且条件 </a-button>
      <a-button icon="plus-circle" type="link" @click="add(1)"> 或条件 </a-button>
    </div>
    <div v-for="(item, index) in dateRule" :key="index">
      <div v-if="item.and_or != ''" style="margin-left: 24px">
        {{ item.and_or == 'and' ? '并且' : '或者' }}
      </div>
      <div class="innerDiv">
        <div v-if="dateRule.length != 1" class="iconDiv">
          <a-icon type="close-circle" @click="delDateAndOr(index)" />
        </div>
        <a-row :gutter="12">
          <a-col :span="4">公式左侧</a-col>
          <a-col :span="4">
            <dc-select
              placeholder="请选择"
              v-model="item.left[0].type"
              @change="val => changeLeftType(val, index)"
              :options="[
                { name: '表单字段', id: 'field' },
                { name: '固定值', id: 'fixed' }
              ]"
            ></dc-select>
          </a-col>
          <a-col :span="6" v-if="item.left[0].type != ''">
            <dc-select
              v-if="item.left[0].type == 'field'"
              v-model="item.left[0].field"
              placeholder="请选择表单字段"
              @change="val => changeLeftField(val, index)"
              :options="renderDateList(dateList)"
            >
            </dc-select>
            <template v-else>
              <dc-date
                v-if="leftFormatList[index] == 'yyyy'"
                mode="year"
                v-model="item.left[0].field"
                placeholder="请选择日期"
                format="yyyy"
                @change="val => changeLeftField(val, index)"
              />
              <dc-date
                v-if="leftFormatList[index] == 'yyyy-MM'"
                v-model="item.left[0].field"
                mode="month"
                placeholder="请选择日期"
                format="yyyy-MM"
                @change="val => changeLeftField(val, index)"
              />
              <dc-date
                v-if="leftFormatList[index] == 'yyyyMM'"
                v-model="item.left[0].field"
                placeholder="请选择日期"
                format="yyyyMM"
                mode="month"
                @change="val => changeLeftField(val, index)"
              />
            </template>
          </a-col>
          <a-col :span="6" v-if="item.left[0].type != '' && showLeftOption[index]">
            <dc-select v-model="item.left[0].value" placeholder="请选择" :options="leftOptions[index]" @change="val => changeLeftVal(val, index)"></dc-select>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="4">判断符</a-col>
          <a-col :span="8">
            <dc-select placeholder="请选择" v-model="item.operator" @change="val => changeOpt(val, index)" :options="operatorList" :fields="{}"></dc-select>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="4">公式右侧</a-col>
          <a-col :span="4">
            <dc-select
              placeholder="请选择"
              v-model="item.right[0].type"
              @change="val => changeRightType(val, index)"
              :options="[
                { name: '表单字段', id: 'field' },
                { name: '固定值', id: 'fixed' }
              ]"
            >
            </dc-select>
          </a-col>
          <a-col :span="6" v-if="item.right[0].type != ''">
            <dc-select
              v-if="item.right[0].type == 'field'"
              v-model="item.right[0].field"
              placeholder="请选择表单字段"
              @change="val => changeRightField(val, index)"
              :options="renderDateList(dateList)"
            >
            </dc-select>
            <template v-else>
              <dc-date
                v-if="rightFormatList[index] == 'yyyy'"
                mode="year"
                v-model="item.right[0].field"
                placeholder="请选择日期"
                format="yyyy"
                @change="val => changeRightField(val, index)"
              />
              <dc-date
                v-if="rightFormatList[index] == 'yyyy-MM'"
                v-model="item.right[0].field"
                placeholder="请选择日期"
                format="yyyy-MM"
                mode="month"
                @change="val => changeRightField(val, index)"
              />
              <dc-date
                v-if="rightFormatList[index] == 'yyyyMM'"
                v-model="item.right[0].field"
                placeholder="请选择日期"
                format="yyyyMM"
                mode="month"
                @change="val => changeRightField(val, index)"
              />
            </template>
          </a-col>
          <a-col :span="6" v-if="item.right[0].type != '' && showRightOption[index]">
            <dc-select v-model="item.right[0].value" placeholder="请选择" :options="rightOptions[index]" @change="val => changeRightVal(val, index)"></dc-select>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
//表单时间校验
export default {
  name: 'RuleDate',
  props: ['value', 'drawingList'],
  data() {
    return {
      dateRule: JSON.parse(JSON.stringify(this.value)),
      operatorList: ['<', '<=', '=', '>=', '>', '!='],
      leftOptions: [[]],
      showLeftOption: [false],
      showRightOption: [false],
      rightOptions: [[]],
      leftFormatList: ['yyyy-MM'],
      rightFormatList: ['yyyy-MM']
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.dateRule = JSON.parse(JSON.stringify(newVal))
        let leftOptions = []
        let showLeftOption = []
        let showRightOption = []
        let rightOptions = []
        let leftFormatList = []
        let rightFormatList = []
        this.dateRule.forEach(dr => {
          let left = dr.left[0]
          let right = dr.right[0]
          let leftItem = this.drawingList.find(item => item.__vModel__ == left.field)
          let rightItem = this.drawingList.find(item => item.__vModel__ == right.field)
          if (leftItem) {
            if (leftItem.__config__.layout === 'tableLayout') {
              showLeftOption.push(true)
              let options = leftItem.columns
                .filter(item => item.type.__config__.tag == 'dc-date')
                .map(item => {
                  let name = item.label
                  let id = item.props
                  let key = item.key
                  return { name, id, key }
                })
              leftOptions.push(options)
              let col = leftItem.columns.find(c => c.props == left.value)
              if (col) {
                rightFormatList.push(col.type.format)
              } else {
                rightFormatList.push('yyyy-MM')
              }
            } else {
              rightFormatList.push(leftItem.format)
              showLeftOption.push(false)
              leftOptions.push([])
            }
          } else {
            rightFormatList.push('yyyy-MM')
            showLeftOption.push(false)
            leftOptions.push([])
          }
          if (rightItem) {
            if (rightItem.__config__.layout === 'tableLayout') {
              showRightOption.push(true)
              let options = rightItem.columns
                .filter(item => item.type.__config__.tag == 'dc-date')
                .map(item => {
                  let name = item.label
                  let id = item.props
                  let key = item.key
                  return { name, id, key }
                })
              rightOptions.push(options)
              let col = rightItem.columns.find(c => c.props == right.value)
              if (col) {
                leftFormatList.push(col.type.format)
              } else {
                leftFormatList.push('yyyy-MM')
              }
            } else {
              leftFormatList.push(rightItem.format)
              showRightOption.push(false)
              rightOptions.push([])
            }
          } else {
            leftFormatList.push('yyyy-MM')
            showRightOption.push(false)
            rightOptions.push([])
          }
        })
        this.showLeftOption = showLeftOption
        this.showRightOption = showRightOption
        this.leftOptions = leftOptions
        this.rightOptions = rightOptions
        this.leftFormatList = leftFormatList
        this.rightFormatList = rightFormatList
      },
      immediate: true
    }
  },
  computed: {
    dateList() {
      return this.drawingList.filter(item => item.__config__.tag == 'dc-date' || item.__config__.layout === 'tableLayout')
    }
  },

  methods: {
    renderDateList(dateList) {
      return dateList.map(item => {
        let name = item.__config__.label
        let id = item.__vModel__
        let key = item.__config__.formId
        return { name, id, key }
      })
    },
    delDateAndOr(index) {
      this.dateRule.splice(index, 1)
      this.dateRule[0].and_or = ''
      this.$emit('input', this.dateRule)
    },

    add(andOr) {
      let newRule = {
        left: [{ operator: '', type: '', value: '', field: '' }],
        operator: '',
        right: [{ operator: '', type: '', value: '', field: '' }],
        and_or: andOr == 0 ? 'and' : 'or'
      }
      this.dateRule.push(newRule)
      this.leftOptions.push([])
      this.showLeftOption.push(false)
      this.showRightOption.push(false)
      this.rightOptions.push([])
      this.$emit('input', this.dateRule)
    },

    changeOpt(val, index) {
      this.dateRule[index].operator = val
      this.$emit('input', this.dateRule)
    },

    changeLeftType(val, index) {
      this.dateRule[index].left[0].type = val
      this.dateRule[index].left[0].value = ''
      this.dateRule[index].left[0].field = ''
      this.$emit('input', this.dateRule)
    },

    changeRightType(val, index) {
      this.dateRule[index].right[0].type = val
      this.dateRule[index].right[0].field = ''
      this.dateRule[index].right[0].value = ''
      this.$emit('input', this.dateRule)
    },

    changeLeftField(val, index) {
      if (this.dateRule[index].right[0].type == 'fixed' && this.dateRule[index].right[0].field && this.dateRule[index].left[0].type != 'fixed') {
        this.dateRule[index].right[0].field = ''
        this.dateRule[index].right[0].value = ''
      }
      this.dateRule[index].left[0].field = val
      this.dateRule[index].left[0].value = ''
      let item = this.drawingList.find(item => item.__vModel__ == val)
      if (val && item && item.__config__.layout === 'tableLayout') {
        this.showLeftOption[index] = true
        this.leftOptions[index] = item.columns
          .filter(item => item.type.__config__.tag == 'dc-date')
          .map(item => {
            let name = item.label
            let id = item.props
            let key = item.key
            return { name, id, key }
          })
      } else {
        if (val && item) {
          this.rightFormatList[index] = item.format
        }
        this.showLeftOption[index] = false
        this.leftOptions[index] = []
      }
      this.$emit('input', this.dateRule)
    },

    changeRightField(val, index) {
      if (this.dateRule[index].left[0].type == 'fixed' && this.dateRule[index].left[0].field && this.dateRule[index].right[0].type != 'fixed') {
        this.dateRule[index].left[0].field = ''
        this.dateRule[index].left[0].value = ''
      }
      this.dateRule[index].right[0].field = val
      this.dateRule[index].right[0].value = ''
      let item = this.drawingList.find(item => item.__vModel__ == val)
      if (val && item && item.__config__.layout === 'tableLayout') {
        this.showRightOption[index] = true
        this.rightOptions[index] = item.columns
          .filter(item => item.type.__config__.tag == 'dc-date')
          .map(item => {
            let name = item.label
            let id = item.props
            let key = item.key
            return { name, id, key }
          })
      } else {
        if (val && item) {
          this.leftFormatList[index] = item.format
        }
        this.showRightOption[index] = false
        this.rightOptions[index] = []
      }
      this.$emit('input', this.dateRule)
    },
    changeLeftVal(val, index) {
      if (this.dateRule[index].right[0].type == 'fixed' && this.dateRule[index].right[0].field) {
        this.dateRule[index].right[0].field = ''
        this.dateRule[index].right[0].value = ''
      }
      this.dateRule[index].left[0].value = val
      let item = this.drawingList.find(item => item.__vModel__ == this.dateRule[index].left[0].field)
      if (val) {
        let col = item.columns.find(col => col.props == val)
        this.rightFormatList[index] = col.type.format
      }
      this.$emit('input', this.dateRule)
    },
    changeRightVal(val, index) {
      if (this.dateRule[index].left[0].type == 'fixed' && this.dateRule[index].left[0].field) {
        this.dateRule[index].left[0].field = ''
        this.dateRule[index].left[0].value = ''
      }
      this.dateRule[index].right[0].value = val
      let item = this.drawingList.find(item => item.__vModel__ == this.dateRule[index].right[0].field)
      if (val) {
        let col = item.columns.find(c => c.props == val)
        this.leftFormatList[index] = col.type.format
      }
      this.$emit('input', this.dateRule)
    },
    validate() {
      let flag = true
      for (let i = 0; i < this.dateRule.length; i++) {
        if (this.dateRule[i].operator == '') {
          flag = false
          break
        }
        if (this.dateRule[i].left[0].type == '' || this.dateRule[i].left[0].field == '') {
          flag = false
          break
        }
        if (this.dateRule[i].right[0].type == '' || this.dateRule[i].right[0].field == '') {
          flag = false
          break
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined)
        } else {
          resolve('时间日期校验组合中不能为空！')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
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
