<template>
  <div>
    <a-textarea :rows="6" placeholder="请输入自定义脚本" v-model="otherValue" @change="change" />
  </div>
</template>

<script>
export default {
  name: 'RuleOther',
  props: ['value'],
  data() {
    return {
      otherValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.otherValue = newVal
    }
  },
  methods: {
    change(e) {
      this.otherValue = e.target.value
      this.$emit('input', e.target.value)
    },

    validate() {
      return new Promise((resolve, reject) => {
        if (this.otherValue != '') {
          resolve(undefined)
        } else {
          resolve('请输入自定义脚本!')
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
