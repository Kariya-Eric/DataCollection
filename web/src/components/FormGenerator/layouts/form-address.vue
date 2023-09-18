<template>
  <div>
    <area-linkage v-model="address" />
    <el-input type="textarea" :rows="3" placeholder="请输入详细地址" v-model="textarea" @input="changeVal" />
  </div>
</template>

<script>
export default {
  name: 'FormAddress',
  props: ['value'],
  watch: {
    value: {
      handler(val) {
        if (val) {
          let addressArray = val.split('/')
          if (addressArray.length > 1) {
            this.address = addressArray[0]
            this.textarea = addressArray[1]
          } else {
            this.address = addressArray[0]
          }
        }
      },
      immediate: true
    },
    address(newVal, oldVal) {
      this.address = newVal
      if (newVal != oldVal) {
        if (newVal) {
          let address = this.textarea == '' ? newVal : newVal + '/' + this.textarea
          this.$emit('input', address)
        } else {
          this.$emit('input', '/' + this.textarea)
        }
      }
    }
  },
  data() {
    return {
      textarea: '',
      address: ''
    }
  },
  methods: {
    changeVal(val) {
      let address = val == '' ? this.address : this.address + '/' + this.textarea
      this.$emit('input', address)
    }
  }
}
</script>

<style scoped lang="scss"></style>
