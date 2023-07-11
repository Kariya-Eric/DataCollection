<template>
  <div class="pagehead">
    <slot name="top" />
    <breadcrumb />
    <div v-if="$slots.default" class="app-content">
      <slot />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  components: { Breadcrumb },
};
</script>

<style lang="scss" scoped>
.pagehead {
  background-color: #f0f2f5;
  opacity: 1;
  height: 54px;
}
</style>
