<template>
  <page-header-layout title="卡片列表">
    <div slot="headerContent" style="padding-bottom: 10px;">
      <div style="margin-bottom: 24px;">
        <span>
          段落示意：蚂蚁金服务设计平台
          ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </span>
      </div>
      <div>
        <el-link type="primary" icon="el-icon-position" :underline="false"
          >快速开始</el-link
        >
        <el-link type="primary" icon="el-icon-help" :underline="false"
          >产品简介</el-link
        >
        <el-link type="primary" icon="el-icon-document" :underline="false"
          >产品文档</el-link
        >
      </div>
    </div>

    <div>
      <el-row :gutter="20">
        <el-col
          :md="8"
          :sm="24"
          v-for="(item, index) in dataSource"
          :key="index"
          style="margin-bottom: 16px;"
        >
          <template v-if="item === null">
            <el-card shadow="hover" class="card" style="height: 100%;">
              <el-link icon="el-icon-plus" class="new-btn" :underline="false"
                >新增产品</el-link
              >
            </el-card>
          </template>
          <template v-else>
            <el-card shadow="hover" class="card">
              <el-row>
                <el-col :span="4">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
                    class="avatar"
                  />
                </el-col>
                <el-col :span="20">
                  <div class="card-title">{{ item.title }}</div>
                  <div class="card-description">
                    <div class="card-description-content">
                      {{ item.content }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="text-align: center;">
                  <el-link :underline="false">操作一</el-link>
                </el-col>
                <el-col :span="12" style="text-align: center;">
                  <el-link :underline="false">操作二</el-link>
                </el-col>
              </el-row>
            </el-card>
          </template>
        </el-col>
      </el-row>
    </div>
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from 'layouts/PageHeaderLayout';

const dataSource = [];
dataSource.push(null);
for (let i = 0; i < 11; i++) {
  dataSource.push({
    title: 'Alipay',
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  });
}

export default {
  components: {
    PageHeaderLayout
  },
  data() {
    return {
      dataSource: dataSource
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 110px;
}

.card {
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;

  .card-title {
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    margin-bottom: 12px;
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);

    .card-description-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-bottom: 1em;
    }
  }
}
</style>
