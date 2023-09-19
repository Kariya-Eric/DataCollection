<template>
  <div>
    <area-linkage v-model="address" />
    <el-input type="textarea" :rows="4" placeholder="请输入详细地址" v-model="textarea" @input="changeVal" v-if="showDetail" />
  </div>
</template>

<script>
export default {
  name: 'FormAddress',
  props: ['value', 'type'],
  watch: {
    type: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          if (newVal == '省（直辖市、自治区）/市/区-详细地址') {
            this.showDetail = true
          } else {
            this.showDetail = false
          }
          this.address = ''
          this.textarea = ''
          this.$emit('input', '')
        }
      },
      immediate: true
    },
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
      showDetail: true,
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
