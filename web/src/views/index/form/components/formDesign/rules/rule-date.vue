<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <el-button icon="el-icon-circle-plus-outline" plain size="small" @click="add(1)"> 且条件 </el-button>
      <el-button icon="el-icon-circle-plus-outline" plain size="small" @click="add(0)"> 或条件 </el-button>
    </div>
    <div v-for="(item, index) in dateRule" :key="index">
      <div v-if="item.and_or != ''" style="margin-left: 24px">
        {{ item.and_or == 'and' ? '并且' : '或者' }}
      </div>
      <div class="innerDiv">
        <div v-if="dateRule.length != 1" class="iconDiv">
          <i class="el-icon-circle-close" @click="delDateAndOr(index)" />
        </div>
        <el-row>
          <el-col :span="3">公式左侧</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="item.left[0].type" style="width: 100%" @change="val => changeLeftType(val, index)">
              <el-option label="表单字段" value="field" />
              <el-option label="固定值" value="fixed" />
            </el-select>
          </el-col>
          <el-col :span="8" v-if="item.left[0].type != ''">
            <el-select
              v-if="item.left[0].type == 'field'"
              v-model="item.left[0].value"
              placeholder="请选择表单字段"
              style="width: 100%"
              @change="val => changeLeftValue(val, index)"
            >
              <el-option v-for="item in dateList" :key="item.__config__.formId" :label="item.__config__.label" :value="item.__vModel__" />
            </el-select>
            <el-date-picker
              v-else
              v-model="item.left[0].value"
              style="width: 100%"
              placeholder="请选择日期"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              @change="val => changeLeftValue(val, index)"
            />
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">判断符</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="item.operator" style="width: 100%" @change="val => changeOpt(val, index)">
              <el-option v-for="(item, index) in operatorList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">公式右侧</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="item.right[0].type" style="width: 100%" @change="val => changeRightType(val, index)">
              <el-option label="表单字段" value="field" />
              <el-option label="固定值" value="fixed" />
            </el-select>
          </el-col>
          <el-col :span="8" v-if="item.right[0].type != ''">
            <el-select
              v-if="item.right[0].type == 'field'"
              v-model="item.right[0].value"
              placeholder="请选择表单字段"
              style="width: 100%"
              @change="val => changeRightValue(val, index)"
            >
              <el-option v-for="item in dateList" :key="item.__config__.formId" :label="item.__config__.label" :value="item.__vModel__" />
            </el-select>
            <el-date-picker
              v-else
              style="width: 100%"
              v-model="item.right[0].value"
              placeholder="请选择日期"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              @change="val => changeRightValue(val, index)"
            />
          </el-col>
        </el-row>
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
      dateRule: this.value,
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
      return this.drawingList.filter(item => item.__config__.tag == 'el-date-picker')
    }
  },

  methods: {
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

<style scoped lang="scss">
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
    /deep/ .el-row {
      margin-bottom: 8px;
    }
    /deep/ .el-col {
      margin-right: 8px;
    }
  }
}
</style>
