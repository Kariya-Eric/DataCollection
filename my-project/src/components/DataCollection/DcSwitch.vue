<template>
  <a-switch :checked="checked" @change="onChange" v-bind="$attrs" />
</template>

<script>
export default {
  name: 'DcSwitch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String]
    }
  },
  computed: {
    checked() {
      return this.value === 1 || this.value === '1'
    }
  },
  methods: {
    onChange(checked) {
      this.$emit('change', checked ? 1 : 0)
    }
  }
}
</script>

<style></style>
