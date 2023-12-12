<template>
  <div class="typeDiv">
    <div style="margin-left: 24px">
      <!-- <a-button icon="plus-circle" type="link" @click="addUnique"> 添加唯一性组合 </a-button> -->
      <!-- <div v-for="(item, index) in uniqueValue" :key="index" class="uniqueForm">
        <dc-select
          v-model="uniqueValue[index]"
          placeholder="请选择表单字段"
          width="85%"
          @change="val => change(val, index)"
          :options="renderDrawingListOption(drawingList)"
        ></dc-select>
        <a-icon type="minus-circle" @click="delUnique(index)" />
      </div> -->
      <a-row :gutter="12">
        <a-col :span="4"><span>唯一性组合</span></a-col>
        <a-col :span="8">
          <dc-select v-model="uniqueValue['table']" placeholder="请选择表格" @change="changeTable" :options="renderDrawingListOption(drawingList)"></dc-select>
        </a-col>
        <a-col :span="10">
          <dc-select multiple v-model="uniqueValue['fields']" placeholder="请选择表格列" @change="changeFields" :options="fieldsOptions"></dc-select>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
// 唯一性校验
export default {
  props: ['value', 'drawingList'],
  data() {
    return {
      uniqueValue: JSON.parse(JSON.stringify(this.value)),
      fieldsOptions: []
    }
  },
  watch: {
    value(newVal) {
      this.uniqueValue = newVal
    }
  },

  methods: {
    renderDrawingListOption(drawingList) {
      return drawingList
        .filter(item => item.__config__.layout === 'tableLayout')
        .map(item => {
          let name = item.__config__.label
          let id = item.__vModel__
          let key = item.__config__.formId
          return { name, id, key }
        })
    },
    // addUnique() {
    //   this.uniqueValue.push('')
    //   this.$emit('input', this.uniqueValue)
    // },

    changeTable(val) {
      this.uniqueValue['table'] = val
      let item = this.drawingList.find(item => item.__vModel__ == val)
      this.fieldsOptions = item.columns.map(item => {
        let name = item.label
        let id = item.props
        let key = item.key
        return { name, id, key }
      })
      this.$emit('input', this.uniqueValue)
    },

    changeFields(val) {
      this.uniqueValue['fields'] = val
      this.$emit('input', this.uniqueValue)
    },

    // delUnique(index) {
    //   this.uniqueValue.splice(index, 1)
    //   this.$emit('input', this.uniqueValue)
    // },

    //校验
    validate() {
      let flag = true
      for (let i = 0; i < this.uniqueValue.length; i++) {
        if (this.uniqueValue[i] == '') {
          flag = false
          break
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined)
        } else {
          resolve('唯一性校验组合中不能为空！')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.typeDiv {
  background-color: #f5f8fd;
  min-height: 100px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  padding-top: 12px;
  padding-bottom: 24px;
  .uniqueForm {
    margin: 12px 0px 12px 0px;
    .anticon {
      margin-left: 12px;
      color: red;
    }
  }
}
</style>
