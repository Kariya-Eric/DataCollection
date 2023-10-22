<template>
  <div class="tooltip">
    <a-row>
      <a-col :span="22">
        <div class="img-div" style="margin-left: 12px; margin-top: 8px">
          <img src="@/assets/icons/description.svg" />
          <span style="margin-left: 8px; font-weight: 600; line-height: 24px">填报提示</span>
        </div>
      </a-col>
      <a-col :span="2">
        <div class="collapse" v-if="uncollapse">
          <span>展开</span>
          <dc-icon type="icon-dc_uncollapse" style="margin-left: 8px" @click="uncollapse = !uncollapse" />
        </div>
        <div class="collapse" v-else>
          <span>收起</span>
          <dc-icon type="icon-dc_collapse" style="margin-left: 8px" @click="uncollapse = !uncollapse" />
        </div>
      </a-col>
    </a-row>
    <a-row v-if="!uncollapse">
      <div class="desc" v-html="description"></div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'FormTooltip',
  props: ['description'],
  data() {
    return {
      uncollapse: true
    }
  },

  methods: {}
}
</script>

<style scoped lang="less">
.tooltip {
  border: 1px dashed #bdceee;
  border-radius: 5px;
  background-color: #f4f8ff;
  min-height: 42px;
  margin-bottom: 24px;
}
.collapse {
  font-size: 14px;
  color: #2f68bd;
  float: right;
  margin-top: 10px;
  margin-right: 24px;
  //   margin-top: 8px;
  //   line-height: 24px;
  .anticon {
    cursor: pointer;
  }
}
.desc {
  font-size: 14px;
  color: #4a4c51;
  margin-left: 32px;
  margin-top: 8px;
}
</style>
