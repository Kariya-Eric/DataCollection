<template>
  <a-input clearable :placeholder="placeholder" v-model="inputVal" @change="changeVal">
    <a-icon slot="prefix" type="mail" />
  </a-input>
</template>

<script>
export default {
  name: 'FormMail',
  props: ['value', 'placeholder'],
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
