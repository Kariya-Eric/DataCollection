<template>
  <el-tooltip
    effect="dark"
    placement="right"
    v-if="getStrLength(value) > length"
  >
    <template #content>
      {{ value }}
    </template>
    <span>{{ cutStr(value, length) + "..." }}</span>
  </el-tooltip>
  <span v-else>{{ value }}</span>
</template>

<script>
import { cutStr, getStrLength } from "./util";
export default {
  name: "Ellipsis",
  props: {
    value: {
      type: String,
      requird: false,
    },
    length: {
      type: Number,
      requird: false,
      default: 25,
    },
  },
  methods: {
    cutStr,
    getStrLength,
  },
};
</script>

<style></style>
