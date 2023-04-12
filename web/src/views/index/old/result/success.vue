<template>
  <div class="app-content">
    <el-card shadow="always" class="app-card">
      <result :is-success="true" :description="description" :title="title">
        <template slot="action">
          <el-button size="small" type="primary">返回列表</el-button>
          <el-button size="small">查看项目</el-button>
          <el-button size="small">打印</el-button>
        </template>
        <div>
          <div
            style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;"
          >
            项目名称
          </div>
          <el-row style="margin-bottom: 16px">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
              <span style="color: rgba(0, 0, 0, 0.85)">项目 ID：</span>
              20180724089
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
              <span style="color: rgba(0, 0, 0, 0.85)">负责人：</span>
              曲丽丽是谁？
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <span style="color: rgba(0, 0, 0, 0.85)">生效时间：</span>
              2016-12-12 ~ 2017-12-12
            </el-col>
          </el-row>
          <el-steps
            :active="1"
            :direction="
              (device !== 'desktop' && directionType.vertical) ||
                directionType.horizontal
            "
          >
            <el-step>
              <span slot="title" style="font-size: 14px">创建项目</span>
              <template slot="description">
                <div
                  slot="description"
                  style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative;"
                >
                  <div style="margin: 8px 0 4px">
                    曲丽丽
                    <el-icon class="el-icon-s-promotion" />
                  </div>
                  <div>2016-12-12 12:32</div>
                </div>
              </template>
            </el-step>
            <el-step title="部门初审">
              <span slot="title" style="font-size: 14px">部门初审</span>
              <template slot="description">
                <div
                  slot="description"
                  style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative;"
                >
                  <div style="margin: 8px 0 4px">
                    周毛毛
                    <el-icon class="el-icon-s-promotion" />
                  </div>
                  <div style="color: #1890ff;"><a href="#">催一下</a></div>
                </div>
              </template>
            </el-step>
            <el-step title="财务复核">
              <span slot="title" style="font-size: 14px">财务复核</span>
            </el-step>
            <el-step title="完成">
              <span slot="title" style="font-size: 14px">完成</span>
            </el-step>
          </el-steps>
        </div>
      </result>
    </el-card>
  </div>
</template>

<script>
import Result from '@/components/Result/Result';
import { mapState } from 'vuex';

// import { mixinDevice } from '@/utils/mixin.js';

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export default {
  name: 'Success',
  components: {
    Result
  },
  // mixins: [mixinDevice],
  data() {
    return {
      title: '提交成功',
      description:
        '提交结果页用于反馈一系列操作任务的处理结果，\n' +
        ' 如果仅是简单操作，使用 Message 全局提示反馈即可。\n' +
        ' 本文字区域可以展示简单的补充说明，如果有类似展示\n' +
        ' “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。',
      directionType
    };
  },
  computed: {
    ...mapState('app', ['device'])
  },
  methods: {
    // isMobile() {
    //   return device != 'desktop';
    // }
  }
};
</script>

<style scoped>
</style>
