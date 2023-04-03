<template>
  <page-header-layout title="标准列表">
    <el-card shadow="always" class="app-card">
      <el-row>
        <el-col :sm="8" :xs="24">
          <head-info title="我的待办" content="8个任务" :bordered="true" />
        </el-col>
        <el-col :sm="8" :xs="24">
          <head-info
            title="本周任务平均处理时间"
            content="32分钟"
            :bordered="true"
          />
        </el-col>
        <el-col :sm="8" :xs="24">
          <head-info title="本周完成任务数" content="24个" />
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="always" class="app-card">
      <div slot="header">
        <el-row>
          <el-col :md="12" :sm="24"><span>标准列表</span></el-col>
          <el-col :md="12" :sm="24">
            <el-row style="float: right;">
              <el-col :md="12" :sm="24">
                <el-radio-group size="mini" v-model="radio1">
                  <el-radio-button label="全部"></el-radio-button>
                  <el-radio-button label="进行中"></el-radio-button>
                  <el-radio-button label="等待中"></el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-input placeholder="" size="mini" v-model="inputsearch">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div>
        <el-button
          style="width: 100%; border-style: dashed;"
          icon="el-icon-plus"
          size="small"
          >添加</el-button
        >
      </div>

      <!-- Table Start -->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        v-loading="isLoading"
        :data="listData"
        style="width: 100%;"
        size="medium"
        :show-header="false"
        fit
      >
        <el-table-column width="80">
          <template v-slot="scope">
            <img :src="scope.row.avatar" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column>
          <template v-slot="scope">
            <div>
              <span>{{ scope.row.title }}</span>
            </div>
            <div>
              <span>{{ scope.row.description }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template v-slot="scope">
            <div><span>Owner</span></div>
            <div>
              <span>{{ scope.row.owner }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template v-slot="scope">
            <div><span>开始时间</span></div>
            <div>
              <span>{{ scope.row.startAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template v-slot="scope">
            <el-progress :percentage="scope.row.progress.value"></el-progress>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template v-slot="scope">
            <el-button type="text">编辑</el-button>
            <el-dropdown trigger="click">
              <span class="link-type">
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <template v-slot:dropdown>
                <el-dropdown-menu style="text-align: center;">
                  <el-dropdown-item>查看</el-dropdown-item>
                  <el-dropdown-item divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div style="float: right;">
        <pagination :total="1000" />
      </div>

      <!-- Table End -->
    </el-card>
  </page-header-layout>
</template>

<script>
import HeadInfo from 'components/tools/HeadInfo';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import Pagination from 'components/Pagination';

const data = [];
data.push({
  title: 'Alipay',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '那是一种内在的东西， 他们到达不了，也无法触及的',
  owner: '付晓晓',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 90
  }
});
data.push({
  title: 'Angular',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  owner: '曲丽丽',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 54
  }
});
data.push({
  title: 'Ant Design',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  description: '生命就像一盒巧克力，结果往往出人意料',
  owner: '林东东',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 66
  }
});
data.push({
  title: 'Ant Design Pro',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  owner: '周星星',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 30
  }
});
data.push({
  title: 'Bootstrap',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  owner: '吴加好',
  startAt: '2018-07-26 22:44',
  progress: {
    status: 'exception',
    value: 100
  }
});

export default {
  components: {
    PageHeaderLayout,
    HeadInfo,
    Pagination
  },
  data() {
    return {
      radio1: '全部',
      inputsearch: '',
      tableKey: 0,
      listData: data,
      isLoading: false
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
</style>
