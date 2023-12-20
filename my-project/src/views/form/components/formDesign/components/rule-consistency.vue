<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <a-button icon="plus-circle" type="link" @click="add(0)"> 且条件 </a-button>
      <a-button icon="plus-circle" type="link" @click="add(1)"> 或条件 </a-button>
    </div>
    <div v-for="(consistency, index) in dataConsistencyVal" :key="index">
      <div v-if="consistency.and_or != ''" style="margin-left: 24px">
        {{ consistency.and_or == 'and' ? '并且' : '或者' }}
      </div>
      <div class="innerDiv">
        <div v-if="dataConsistencyVal.length != 1" class="iconDiv">
          <a-icon type="close-circle" @click="del(index)" />
        </div>
        <a-row v-for="(left, leftIndex) in consistency.left" :key="'left' + leftIndex" :gutter="12">
          <a-col :span="4">
            <span v-if="leftIndex == 0"> 当前表字段 </span>
          </a-col>
          <a-col :span="8">
            <dc-select
              placeholder="请选择当前表字段"
              v-model="left.field"
              :options="renderDrawingListOption(drawingList)"
              @change="val => changeLeftField(val, leftIndex, index)"
            ></dc-select>
          </a-col>
          <a-col :span="8" v-if="showLeftOption[index][leftIndex]">
            <dc-select v-model="left.value" placeholder="请选择" :options="leftOptions[index][leftIndex]"></dc-select>
          </a-col>
          <a-col :span="2">
            <div class="rowIcon" v-if="leftIndex == 0">
              <a-icon type="plus-circle" @click="addLeft(index)" />
            </div>
            <div v-else class="rowIconDel">
              <a-icon type="minus-circle" @click="delLeft(leftIndex, index)" />
            </div>
          </a-col>
        </a-row>
        <a-row v-for="(right, rightIndex) in consistency.right" :key="'right' + rightIndex" :gutter="12">
          <a-col :span="4">
            <span v-if="rightIndex == 0"> 与关联表 </span>
          </a-col>
          <a-col :span="5">
            <dc-select v-model="right.formId" :options="selectedFormList" placeholder="请选择关联表" @change="val => changeForm(val, rightIndex, index)"></dc-select>
          </a-col>
          <a-col :span="6">
            <dc-select
              v-model="right.field"
              @change="val => changeRightField(val, rightIndex, index)"
              :options="rightFieldOptions[index][rightIndex]"
              placeholder="请选择关联表字段"
            ></dc-select>
          </a-col>
          <a-col :span="5" v-if="showRightOption[index][rightIndex]">
            <dc-select v-model="right.value" :options="rightOptions[index][rightIndex]" placeholder="请选择"></dc-select>
          </a-col>
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
</template>

<script>
export default {
  name: 'RuleConsistency',
  props: ['value', 'drawingList', 'formList'],
  data() {
    return {
      dataConsistencyVal: JSON.parse(JSON.stringify(this.value)),
      showLeftOption: [[]],
      showRightOption: [[]],
      leftOptions: [[]],
      rightOptions: [[]],
      rightFieldOptions: [[]]
    }
  },
  computed: {
    selectedFormList() {
      return this.formList.map(item => {
        const { name, id } = item
        return { name, id }
      })
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.dataConsistencyVal = JSON.parse(JSON.stringify(newVal))
        let showLeftOption = [[]]
        let showRightOption = [[]]
        let leftOptions = [[]]
        let rightOptions = [[]]
        let rightFieldOptions = [[]]
        this.dataConsistencyVal.forEach((data, i) => {
          let left = data.left
          leftOptions[i] = []
          rightOptions[i] = []
          showRightOption[i] = []
          showLeftOption[i] = []
          rightFieldOptions[i] = []
          left.forEach((l, j) => {
            if (l.value) {
              let item = this.drawingList.find(d => d.__vModel__ == l.field)
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
          })
          let right = data.right
          right.forEach((r, j) => {
            let form = this.formList.find(f => (f.id = r.formId))
            if (form) {
              let rightList = JSON.parse(form.componentProperties)
              rightFieldOptions[i][j] = rightList.map(item => {
                let name = item.__config__.label
                let id = item.__vModel__
                let key = item.__config__.formId
                return { name, id, key }
              })
              if (r.value) {
                let item = rightList.find(d => d.__vModel__ == r.field)
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
              rightFieldOptions[i][j] = []
              rightOptions[i][j] = []
              showRightOption[i][j] = false
            }
          })
        })
        this.rightFieldOptions = rightFieldOptions
        this.leftOptions = leftOptions
        this.showLeftOption = showLeftOption
        this.rightOptions = rightOptions
        this.showRightOption = showRightOption
        console.log('w', this.dataConsistencyVal)
      },
      immediate: true
    }
  },
  methods: {
    changeForm(val, rightIndex, index) {
      this.rightFieldOptions[index][rightIndex] = []
      this.dataConsistencyVal[index].right[rightIndex].formId = val
      this.dataConsistencyVal[index].right[rightIndex].field = ''
      this.dataConsistencyVal[index].right[rightIndex].value = ''
      if (val) {
        let form = this.formList.find(f => (f.id = val))
        let options = JSON.parse(form.componentProperties).map(item => {
          let name = item.__config__.label
          let id = item.__vModel__
          let key = item.__config__.formId
          return { name, id, key }
        })
        this.rightFieldOptions[index][rightIndex] = options
      }
      this.$emit('input', this.dataConsistencyVal)
    },

    delLeft(leftIndex, index) {
      this.dataConsistencyVal[index].left.splice(leftIndex, 1)
      this.showLeftOption[index].splice(leftIndex, 1)
      this.leftOptions[index].splice(leftIndex, 1)
      this.$emit('input', this.dataConsistencyVal)
    },
    addLeft(index) {
      let left = { operator: '', type: 'field', value: '', field: '', formId: 'current' }
      this.dataConsistencyVal[index].left.push(left)
      this.showLeftOption[index].push(false)
      this.leftOptions[index].push([])
      this.$emit('input', this.dataConsistencyVal)
    },
    addRight(index) {
      let right = { operator: '', type: 'field', value: '', field: '', formId: '' }
      this.dataConsistencyVal[index].right.push(right)
      this.showRightOption[index].push(false)
      this.rightFieldOptions[index].push([])
      this.rightOptions[index].push([])
      this.$emit('input', this.dataConsistencyVal)
    },
    delRight(rightIndex, index) {
      this.dataConsistencyVal[index].right.splice(rightIndex, 1)
      this.showRightOption[index].splice(rightIndex, 1)
      this.rightOptions[index].splice(rightIndex, 1)
      this.rightFieldOptions[index].splice[(rightIndex, 1)]
      this.$emit('input', this.dataConsistencyVal)
    },
    del(index) {
      this.dataConsistencyVal.splice(index, 1)
      this.dataConsistencyVal[0].and_or = ''
      this.showLeftOption.splice(index, 1)
      this.showRightOption.splice(index, 1)
      this.leftOptions.splice(index, 1)
      this.rightOptions.splice(index, 1)
      this.rightFieldOptions.splice(index, 1)
      this.$emit('input', this.dataConsistencyVal)
    },

    add(andOr) {
      let consistency = {
        left: [{ operator: '', type: 'field', value: '', field: '', formId: 'current' }],
        operator: '',
        right: [{ operator: '', type: 'field', value: '', field: '', formId: '' }],
        and_or: andOr == 0 ? 'and' : 'or'
      }
      this.dataConsistencyVal.push(consistency)
      this.showLeftOption.push([])
      this.showRightOption.push([])
      this.leftOptions.push([])
      this.rightOptions.push([])
      this.rightFieldOptions.push(JSON.parse(JSON.stringify(this.selectedFormList)))
      this.$emit('input', this.dataConsistencyVal)
    },

    renderDrawingListOption(drawingList) {
      return drawingList.map(item => {
        let name = item.__config__.label
        let id = item.__vModel__
        let key = item.__config__.formId
        return { name, id, key }
      })
    },

    changeLeftField(val, leftIndex, index) {
      this.dataConsistencyVal[index].left[leftIndex].field = val
      this.dataConsistencyVal[index].left[leftIndex].value = ''
      let item = this.drawingList.find(item => item.__vModel__ == val)
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
      this.$emit('input', this.dataConsistencyVal)
    },

    changeRightField(val, rightIndex, index) {
      this.dataConsistencyVal[index].right[rightIndex].field = val
      this.dataConsistencyVal[index].right[rightIndex].value = ''
      let form = this.formList.find(f => (f.id = this.dataConsistencyVal[index].right[rightIndex].formId))
      let item = JSON.parse(form.componentProperties).find(item => item.__vModel__ == val)
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
      this.$emit('input', this.dataConsistencyVal)
    },

    validate() {
      let flag = true
      outer: for (let i = 0; i < this.dataConsistencyVal.length; i++) {
        for (let j = 0; j < this.dataConsistencyVal[i].left.length; j++) {
          if (this.dataConsistencyVal[i].left[j].field == '') {
            flag = false
            break outer
          }
        }
        for (let j = 0; j < this.dataConsistencyVal[i].right.length; j++) {
          if (this.dataConsistencyVal[i].right[j].field == '' || this.dataConsistencyVal[i].right[j].formId == '') {
            flag = false
            break outer
          }
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined)
        } else {
          resolve('一致性校验组合中不能为空！')
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
