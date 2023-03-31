<template>
  <layout-wrapper class="page-workplace">
    <a-card :bordered="false">
      <a-button @click="show"></a-button>
    </a-card>
    <a-card :bordered="false"> 空白页面一 </a-card>
    <a-card :bordered="false"> 空白页面一 </a-card>
    <nav-footer style="padding-bottom: 0" />
    <form-generator ref="formGenerator" />
  </layout-wrapper>
</template>

<script>
import { NavFooter } from "@/components";
import FormGenerator from "../form/component/form-generator.vue";
export default {
  name: "WorkPlace",
  components: {
    NavFooter,
    FormGenerator,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    show() {
      this.$refs.formGenerator.show();
    },
  },
};
</script>

<style lang="less" scoped>
.page-workplace {
  min-height: calc(100vh - 201px);
  .date-filter {
    display: flex;
    justify-content: space-between;
    &__item {
      line-height: 40px;
      margin-right: 24px;
      cursor: pointer;
      transition: all 0.15s;
      &.is-active {
        color: @primary-color;
      }
    }
    &__picker {
      width: 300px;
    }
  }
  .indicator-card {
    display: flex;
    &__item {
      flex: 1;
      height: 160px;
      position: relative;
      &:not(:last-child) {
        margin-right: 24px;
      }
    }
    &__label {
      width: 100%;
      height: 24px;
      line-height: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(0, 0, 0, 0.45) !important;
    }
    &__icon-info {
      margin-left: 16px;
      width: 14px;
      height: 14px;
      color: rgba(0, 0, 0, 0.45) !important;
    }
    &__value {
      font-size: 30px;
      line-height: 88px;
      text-align: center;
    }
  }
  .chart-card {
    margin-top: 16px;
    min-height: 240px;
  }
}
</style>
