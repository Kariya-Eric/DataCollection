<template>
  <el-select v-model="selectValue" v-bind="$attrs" @change="changeSelect">
    <group-option v-for="(group, k) in options" :key="k" :label="group.label">
      <el-checkbox v-model="checked[k]" class="group-check" :indeterminate="indeterminate[k]" @change="val => selectAll(val, group, k)">
        {{ group.label }}
      </el-checkbox>
      <el-option v-for="(item, key) in group.options" :key="key" :label="item.name || item.label" :value="item.id || item.value" :disabled="item.disabled" />
    </group-option>
  </el-select>
</template>

<script>
import GroupOption from './group-option'
export default {
  components: { GroupOption },
  name: 'SelectGroup',
  props: ['value', 'options'],
  watch: {
    value(newVal) {
      if (newVal) {
        this.selectValue = newVal
      } else {
        this.selectValue = []
        this.checked = this.options.map(opt => {
          return false
        })
        this.indeterminate = this.options.map(opt => {
          return false
        })
      }
    }
  },
  data() {
    return {
      selectValue: [],
      checked: this.options.map(opt => {
        return false
      }),
      indeterminate: this.options.map(opt => {
        return false
      })
    }
  },
  methods: {
    // 点击全选框时
    selectAll(val, group, k) {
      let set = new Set()
      this.selectValue.forEach(val => set.add(val))
      if (val) {
        group.options
          .filter(opt => !opt.disabled)
          .forEach(opt => {
            let value = opt.id || opt.value
            set.add(value)
          })

        this.selectValue = Array.from(set)
        this.checked[k] = true
      } else {
        group.options.forEach(opt => {
          let value = opt.id || opt.value
          set.delete(value)
        })
        this.selectValue = Array.from(set)
        this.checked[k] = false
      }
      this.indeterminate[k] = false
      this.$emit('input', this.selectValue)
    },

    // 选项发生变化时
    changeSelect() {
      this.options.forEach((group, ind) => {
        let count = 0
        for (let i = 0; i < group.options.length; i++) {
          let value = group.options[i].id || group.options[i].value
          let index = this.selectValue.indexOf(value)
          if (index != -1 && !group.options[i].disabled) {
            count++
          }
        }
        if (count == 0) {
          this.checked[ind] = false
          this.indeterminate[ind] = false
        } else if (count == group.options.filter(opt => !opt.disabled).length) {
          this.checked[ind] = true
          this.indeterminate[ind] = false
        } else {
          this.checked[ind] = false
          this.indeterminate[ind] = true
        }
      })
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
