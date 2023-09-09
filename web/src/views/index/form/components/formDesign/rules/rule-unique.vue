<template>
  <div class="typeDiv">
    <el-row>
      <el-col :span="4">
        <span style="margin-left: 24px"> 唯一性组合 </span>
      </el-col>
      <el-col :span="20">
        <div>
          <el-button icon="el-icon-circle-plus-outline" type="text" @click="addUnique"> 添加唯一性组合 </el-button>
          <div v-for="(item, index) in uniqueValue" :key="index" class="uniqueForm">
            <el-select v-model="uniqueValue[index]" placeholder="请选择表单字段" style="width: 50%" @change="val => change(val, index)">
              <el-option v-for="item in drawingList" :key="item.__config__.formId" :label="item.__config__.label" :value="item.__vModel__" />
            </el-select>
            <i class="el-icon-remove-outline" v-if="uniqueValue.length > 1" @click="delUnique(index)" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 唯一性校验
export default {
  props: ['value', 'drawingList'],
  data() {
    return {
      uniqueValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.uniqueValue = newVal
    }
  },

  methods: {
    addUnique() {
      this.uniqueValue.push('')
      this.$emit('input', this.uniqueValue)
    },

    change(val, index) {
      this.uniqueValue[index] = val
      this.$emit('input', this.uniqueValue)
    },

    delUnique(index) {
      this.uniqueValue.splice(index, 1)
      this.$emit('input', this.uniqueValue)
    },

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

<style scoped lang="scss">
.typeDiv {
  background-color: #f5f8fd;
  min-height: 200px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  padding-top: 12px;
  padding-bottom: 24px;
  .uniqueForm {
    margin: 12px 0px 12px 0px;
  }
}
</style>
