<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <a-button icon="plus-circle" type="link" @click="add(0)"> 且条件 </a-button>
      <a-button icon="plus-circle" type="link" @click="add(1)"> 或条件 </a-button>
    </div>
    <div v-for="(range, index) in dataRangeVal" :key="index">
      <div v-if="range.and_or != ''" style="margin-left: 24px">
        {{ range.and_or == 'and' ? '并且' : '或者' }}
      </div>
      <div class="innerDiv">
        <div v-if="dataRangeVal.length != 1" class="iconDiv">
          <a-icon type="close-circle" @click="del(index)" />
        </div>
        <a-row v-for="(left, leftIndex) in range.left" :key="'left' + leftIndex" :gutter="12">
          <a-col :span="4">
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
          <a-col :span="8">
            <dc-select
              placeholder="请选择"
              v-model="left.type"
              @change="val => changeLeftType(val, leftIndex, index)"
              :options="[
                { name: '表单字段', id: 'field' },
                { name: '固定值', id: 'fixed' }
              ]"
            ></dc-select>
          </a-col>

          <a-col :span="8" v-if="left.type != ''">
            <dc-select
              v-if="left.type == 'field'"
              v-model="left.value"
              @change="val => changeLeftValue(val, leftIndex, index)"
              :options="renderDrawingListOption(drawingList)"
            ></dc-select>
            <a-input v-else v-model="left.value" placeholder="请输入" @change="e => changeLeftInputValue(e, leftIndex, index)" />
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

        <a-row :gutter="12">
          <a-col :span="4">判断符</a-col>
          <a-col :span="8">
            <dc-select placeholder="请选择" v-model="range.operator" @change="val => changeOpt(val, index)" :options="operatorList" :fields="{}"></dc-select>
          </a-col>
        </a-row>

        <a-row v-for="(right, rightIndex) in range.right" :key="'right' + rightIndex" :gutter="12">
          <a-col :span="4">
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
          <a-col :span="8">
            <dc-select
              placeholder="请选择"
              v-model="right.type"
              @change="val => changeRightType(val, rightIndex, index)"
              :options="[
                { name: '表单字段', id: 'field' },
                { name: '固定值', id: 'fixed' }
              ]"
            ></dc-select>
          </a-col>
          <a-col :span="8" v-if="right.type != ''">
            <dc-select
              v-if="right.type == 'field'"
              v-model="right.value"
              @change="val => changeRightValue(val, rightIndex, index)"
              :options="renderDrawingListOption(drawingList)"
            ></dc-select>
            <a-input v-else v-model="right.value" placeholder="请输入" @change="e => changeRightInputValue(e, rightIndex, index)" />
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
  name: 'RuleRange',
  props: ['value', 'drawingList'],
  data() {
    return {
      dataRangeVal: JSON.parse(JSON.stringify(this.value)),
      operatorList: ['<', '<=', '=', '>=', '>', '!='],
      calculateList: ['+', '-', '*', '/']
    }
  },
  watch: {
    value(newVal) {
      this.dataRangeVal = newVal
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
      this.$emit('input', this.dataRangeVal)
    },

    add(andOr) {
      let range = {
        left: [{ operator: '', type: '', value: '' }],
        operator: '',
        right: [{ operator: '', type: '', value: '' }],
        and_or: andOr == 0 ? 'and' : 'or'
      }
      this.dataRangeVal.push(range)
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftType(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].type = val
      this.dataRangeVal[index].left[leftIndex].value = ''
      this.$emit('input', this.dataRangeVal)
    },
    changeRightType(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].type = val
      this.dataRangeVal[index].right[rightIndex].value = ''
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftInputValue(e, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].value = e.target.value
      this.$emit('input', this.dataRangeVal)
    },

    changeRightInputValue(e, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].value = e.target.value
      this.$emit('input', this.dataRangeVal)
    },

    changeLeftValue(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].value = val
      this.$emit('input', this.dataRangeVal)
    },
    changeRightValue(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].value = val
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
      let left = { operator: '', type: '', value: '' }
      this.dataRangeVal[index].left.push(left)
      this.$emit('input', this.dataRangeVal)
    },

    addRight(index) {
      let right = { operator: '', type: '', value: '' }
      this.dataRangeVal[index].right.push(right)
      this.$emit('input', this.dataRangeVal)
    },

    delLeft(leftIndex, index) {
      this.dataRangeVal[index].left.splice(leftIndex, 1)
      this.$emit('input', this.dataRangeVal)
    },

    delRight(rightIndex, index) {
      this.dataRangeVal[index].right.splice(rightIndex, 1)
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
          if (this.dataRangeVal[i].left[j].type == '' || this.dataRangeVal[i].left[j].value == '') {
            flag = false
            break outer
          }
          if (j != 0 && this.dataRangeVal[i].left[j].operator == '') {
            flag = false
            break outer
          }
        }
        for (let j = 0; j < this.dataRangeVal[i].right.length; j++) {
          if (this.dataRangeVal[i].right[j].type == '' || this.dataRangeVal[i].right[j].value == '') {
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
