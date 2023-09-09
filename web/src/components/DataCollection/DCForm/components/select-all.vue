<template>
  <el-select v-model="selectValue" v-bind="$attrs" @change="changeSelect">
    <el-checkbox v-model="checked" class="group-check" :indeterminate="indeterminate" @change="selectAll"> 全选 </el-checkbox>
    <el-option v-for="(item, key) in options" :key="key" :label="item.name || item.label" :value="item.id || item.value" :disabled="item.disabled" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectAll',
  props: ['value', 'options'],
  watch: {
    value(newVal) {
      if (newVal && newVal.length > 0) {
        this.selectValue = newVal
      } else {
        this.selectValue = []
        this.checked = false
        this.indeterminate = false
      }
    }
  },
  data() {
    return {
      selectValue: [],
      checked: false,
      indeterminate: false
    }
  },
  methods: {
    // 点击全选框时
    selectAll(val) {
      this.checked = val
      this.selectValue = this.options
        .filter(item => !item.disabled)
        .map(item => {
          let value = item.id || item.value
          return value
        })
      this.indeterminate = false
      this.$emit('input', this.selectValue)
    },

    // 选项发生变化时
    changeSelect() {
      this.checked = this.selectValue.length == this.options.filter(item => !item.disabled).length
      this.indeterminate = this.selectValue.length != 0 && this.selectValue.length < this.options.filter(item => !item.disabled).length
      this.$emit('input', this.selectValue)
    }
  }
}
</script>

<style scoped lang="scss">
.group-check {
  margin: 8px 16px 8px 16px;
}
</style>
