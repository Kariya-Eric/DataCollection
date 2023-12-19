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
            <dc-select v-model="left.value" placeholder="请选择" :options="[]"></dc-select>
          </a-col>
          <a-col :span="2">
            <div class="rowIcon" v-if="leftIndex == 0">
              <a-icon type="plus-circle" @click="addLeft(index)" />
            </div>
            <div v-else class="rowIconDel">
              <a-icon type="minus-circle" />
            </div>
          </a-col>
        </a-row>
        <a-row v-for="(right, rightIndex) in consistency.right" :key="'right' + rightIndex" :gutter="12">
          <a-col :span="4">
            <span v-if="rightIndex == 0"> 与关联表 </span>
          </a-col>
          <a-col :span="5">
            <dc-select v-model="right.formId" :options="[]" placeholder="请选择关联表"></dc-select>
          </a-col>
          <a-col :span="6">
            <dc-select v-model="right.field" :options="[]" placeholder="请选择关联表字段"></dc-select>
          </a-col>
          <a-col :span="5" v-if="showRightOption[index][rightIndex]">
            <dc-select v-model="right.value" :options="[]" placeholder="请选择"></dc-select>
          </a-col>
          <a-col :span="2">
            <div class="rowIcon" v-if="rightIndex == 0">
              <a-icon type="plus-circle" @click="addRight(index)" />
            </div>
            <div v-else class="rowIconDel">
              <a-icon type="minus-circle" />
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
  props: ['value', 'drawingList'],
  data() {
    return {
      dataConsistencyVal: JSON.parse(JSON.stringify(this.value)),
      showLeftOption: [[]],
      showRightOption: [[]]
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.dataConsistencyVal = JSON.parse(JSON.stringify(newVal))
      },
      immediate: true
    }
  },
  methods: {
    addLeft(index) {
      let left = { operator: '', type: 'field', value: '', field: '', formId: 'cuurent' }
      this.dataConsistencyVal[index].left.push(left)
      this.$emit('input', this.dataConsistencyVal)
    },
    addRight(index) {},
    del(index) {
      this.dataConsistencyVal.splice(index, 1)
      this.dataConsistencyVal[0].and_or = ''
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

    changeLeftField(val, leftIndex, index) {}
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
