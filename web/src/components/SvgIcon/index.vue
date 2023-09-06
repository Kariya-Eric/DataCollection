<template>
  <span @click="click">
    <svg class="svg-icon" aria-hidden="true" :style="{ width, height }">
      <use :xlink:href="iconName" :fill="color" />
    </svg>
  </span>
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
    color: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
  methods: {
    click() {
      console.log("click");
      this.$emit("click");
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
