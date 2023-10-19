<template>
  <a-card :tab-list="tabList" :active-tab-key="activeKey" @tabChange="key => (activeKey = key)" style="height: 360px">
    <div v-if="activeKey === '1'">
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="personal-div">
            <a-row style="text-align: center">
              <p><strong>12</strong></p>
              <p>校领导（人）</p>
            </a-row>
            <a-row style="text-align: center">
              <a-col :span="12">
                <p><strong>9</strong></p>
                <p>中国党员（人）</p>
              </a-col>
              <a-col :span="12">
                <p><strong>75%</strong></p>
                <p>中共党员占领导比例</p>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="8">
          <academic-distribution />
        </a-col>
        <a-col :span="8">
          <age-distribution />
        </a-col>
      </a-row>
    </div>
    <div v-if="activeKey === '2'">
      <a-row :gutter="12">
        <a-col :span="6">
          <div class="row-div">
            <a-row :gutter="3">
              <a-col :span="6">
                <a-icon type="appstore" theme="twoTone" style="font-size: 52px" />
              </a-col>
              <a-col :span="16">
                <p><strong>33</strong></p>
                <p>校级管理员（人）</p>
              </a-col>
            </a-row>
          </div>
          <div class="row-div">
            <a-row :gutter="3">
              <a-col :span="6">
                <a-icon type="appstore" theme="twoTone" style="font-size: 52px" />
              </a-col>
              <a-col :span="16">
                <p><strong>25</strong></p>
                <p>中共党员（人）</p>
              </a-col>
            </a-row>
          </div>
          <div class="row-div">
            <a-row :gutter="3">
              <a-col :span="6">
                <a-icon type="appstore" theme="twoTone" style="font-size: 52px" />
              </a-col>
              <a-col :span="16">
                <p><strong>75%</strong></p>
                <p>中共党员占校级管理人员比例</p>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="12" style="height: 330px">
          <title-academic-distribution />
        </a-col>
        <a-col :span="6"> </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script>
import AgeDistribution from './charts/age-distribution.vue'
import AcademicDistribution from './charts/academic-distribution.vue'
import TitleAcademicDistribution from './charts/title-academic-distribution.vue'
export default {
  name: 'PersonalStructureCard',
  components: { AgeDistribution, AcademicDistribution, TitleAcademicDistribution },
  data() {
    return {
      tabList: [
        { key: '1', tab: '校领导人员结构' },
        { key: '2', tab: '校级教学管理人员机构' },
        { key: '3', tab: '师生党员人数及发展情况' }
      ],
      activeKey: '1'
    }
  }
}
</script>

<style lang="less" scoped>
.personal-div {
  border: 1px solid #e8e8e8;
  width: 80%;
  margin: auto;
  margin-top: 36px;
}
.row-div {
  border: 1px solid #e8e8e8;
  margin: auto;
  margin-bottom: 12px;
  padding: 8px 0px 0px 8px;
}
</style>
