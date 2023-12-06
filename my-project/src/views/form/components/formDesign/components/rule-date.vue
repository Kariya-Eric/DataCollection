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
          <a-col :span="8">
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
          <a-col :span="8" v-if="item.left[0].type != ''">
            <dc-select
              v-if="item.left[0].type == 'field'"
              v-model="item.left[0].value"
              placeholder="请选择表单字段"
              @change="val => changeLeftValue(val, index)"
              :options="renderDateList(dateList)"
            >
            </dc-select>
            <dc-date v-else v-model="item.left[0].value" style="width: 100%" placeholder="请选择日期" format="yyyy-MM-dd" @change="val => changeLeftValue(val, index)" />
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
          <a-col :span="8">
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
          <a-col :span="8" v-if="item.right[0].type != ''">
            <dc-select
              v-if="item.right[0].type == 'field'"
              v-model="item.right[0].value"
              placeholder="请选择表单字段"
              @change="val => changeRightValue(val, index)"
              :options="renderDateList(dateList)"
            >
            </dc-select>
            <dc-date v-else v-model="item.right[0].value" placeholder="请选择日期" format="yyyy-MM-dd" @change="val => changeRightValue(val, index)" />
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
      operatorList: ['<', '<=', '=', '>=', '>', '!=']
    }
  },
  watch: {
    value(newVal) {
      this.dateRule = newVal
    }
  },
  computed: {
    dateList() {
      return this.drawingList.filter(item => item.__config__.tag == 'dc-date')
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
        left: [{ operator: '', type: '', value: '' }],
        operator: '',
        right: [{ operator: '', type: '', value: '' }],
        and_or: andOr == 0 ? 'and' : 'or'
      }
      this.dateRule.push(newRule)
      this.$emit('input', this.dateRule)
    },

    changeOpt(val, index) {
      this.dateRule[index].operator = val
      this.$emit('input', this.dateRule)
    },

    changeLeftType(val, index) {
      this.dateRule[index].left[0].type = val
      this.dateRule[index].left[0].value = ''
      this.$emit('input', this.dateRule)
    },

    changeRightType(val, index) {
      this.dateRule[index].right[0].type = val
      this.dateRule[index].right[0].value = ''
      this.$emit('input', this.dateRule)
    },

    changeLeftValue(val, index) {
      this.dateRule[index].left[0].value = val
      this.$emit('input', this.dateRule)
    },

    changeRightValue(val, index) {
      this.dateRule[index].right[0].value = val
      this.$emit('input', this.dateRule)
    },

    validate() {
      let flag = true
      for (let i = 0; i < this.dateRule.length; i++) {
        if (this.dateRule[i].operator == '') {
          flag = false
          break
        }
        if (this.dateRule[i].left[0].type == '' || this.dateRule[i].left[0].value == '') {
          flag = false
          break
        }
        if (this.dateRule[i].right[0].type == '' || this.dateRule[i].right[0].value == '') {
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
