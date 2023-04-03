<template>
  <page-header-layout title="分步表单">
    <div slot="headerContent" style="padding-bottom: 10px;">
      <div>
        <span>
          将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。
        </span>
      </div>
    </div>

    <el-card shadow="always" class="app-card">
      <el-col
        :md="{ span: 12, offset: 6 }"
        :sm="{ span: 24, offset: 0 }"
        style="padding: 50px 0;"
      >
        <el-steps
          :active="currentTab"
          :direction="
            (device !== 'desktop' && directionType.vertical) ||
              directionType.horizontal
          "
          finish-status="success"
        >
          <el-step title="填写转账信息" />
          <el-step title="确认转账信息" />
          <el-step title="完成" />
        </el-steps>
      </el-col>

      <div>
        <step1 v-if="currentTab === 0" @nextStep="nextStep" />
        <step2
          v-if="currentTab === 1"
          @nextStep="nextStep"
          @prevStep="prevStep"
        />
        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish" />
      </div>
    </el-card>
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { mapState } from 'vuex';

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export default {
  components: {
    PageHeaderLayout,
    Step1,
    Step2,
    Step3
  },
  data() {
    return {
      directionType,
      currentTab: 0
    };
  },
  computed: {
    ...mapState('app', ['device'])
  },
  methods: {
    // handler
    nextStep() {
      if (this.currentTab < 2) {
        this.currentTab += 1;
      }
    },
    prevStep() {
      if (this.currentTab > 0) {
        this.currentTab -= 1;
      }
    },
    finish() {
      this.currentTab = 0;
    }
  }
};
</script>

<style lang="scss" scoped></style>
