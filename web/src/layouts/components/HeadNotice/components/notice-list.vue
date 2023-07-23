<template>
  <div>
    <h5>{{ notice.content }}</h5>
    <span>{{ notice.pushTime }}</span>
    <el-divider />
  </div>
</template>

<script>
export default {
  name: "NoticeList",
  props: ["notice"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
