<template>
  <a-input clearable :placeholder="placeholder" v-model="inputVal" :maxlength="!isMobile ? 11 : null" @change="changeVal">
    <a-icon slot="prefix" type="phone" />
  </a-input>
</template>

<script>
export default {
  name: 'FormPhone',
  props: ['value', 'placeholder', 'isMobile'],
  watch: {
    value(val) {
      this.inputVal = val
    }
  },
  data() {
    return {
      inputVal: this.value
    }
  },
  methods: {
    changeVal(e) {
      this.inputVal = e.target.value
      this.$emit('input', this.inputVal)
    }
  }
}
</script>

<style></style>
