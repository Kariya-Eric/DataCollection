<template>
  <div>
    <slot name="top" />
    <page-header :title="title"> </page-header>
    <div v-if="$slots.default" class="app-content">
      <slot />
    </div>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader.vue";
export default {
  components: {
    PageHeader,
  },
  props: {
    avatar: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    title: {
      type: [String, Boolean],
      default: true,
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
