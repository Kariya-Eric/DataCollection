<template>
  <div>
    <slot name="top" />
    <page-header />
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
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
