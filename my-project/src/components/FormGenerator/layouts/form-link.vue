<template>
  <a-input clearable :placeholder="placeholder" v-model="inputVal" @change="changeVal" :disabled="disabled">
    <a-icon slot="prefix" type="link" />
  </a-input>
</template>

<script>
export default {
  name: 'FormLink',
  props: ['value', 'placeholder', 'disabled'],
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
