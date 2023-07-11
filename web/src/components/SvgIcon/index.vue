<template>
  <svg class="svg-icon" aria-hidden="true" :width="width" :height="height">
    <use :href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "1em",
    },
    height: {
      type: String,
      default: "1em",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
};
</script>

<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
