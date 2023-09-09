<template>
  <span>{{ lastTime | format }}</span>
</template>

<script>
export default {
  name: 'DCStatistic',
  props: {
    format: {}
  }
}
</script>

<style></style>
