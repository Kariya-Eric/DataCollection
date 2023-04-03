<template>
  <page-header-layout
    title="单号：234231029431"
    logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
  >
    <template v-slot:action>
      <el-button-group style="margin-right: 4px;">
        <el-button size="small">操作</el-button>
        <el-button size="small">操作</el-button>
        <el-dropdown>
          <el-button size="small">
            ...
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>选项一</el-dropdown-item>
            <el-dropdown-item>选项二</el-dropdown-item>
            <el-dropdown-item>选项三</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
      <el-button size="small" type="primary">主操作</el-button>
    </template>
    <detail-list
      slot="headerContent"
      size="small"
      :col="2"
      class="detail-layout"
    >
      <detail-list-item term="创建人">曲丽丽</detail-list-item>
      <detail-list-item term="订购产品">XX服务</detail-list-item>
      <detail-list-item term="创建时间">2018-08-07</detail-list-item>
      <detail-list-item term="关联单据"><a>12421</a></detail-list-item>
      <detail-list-item term="生效日期">
        2018-08-07 ~ 2018-12-11
      </detail-list-item>
      <detail-list-item term="备注">请于两个工作日内确认</detail-list-item>
    </detail-list>

    <el-row slot="extra" class="status-list">
      <el-col :xs="12" :sm="12">
        <div class="text">状态</div>
        <div class="heading">待审批</div>
      </el-col>
      <el-col :xs="12" :sm="12">
        <div class="text">订单金额</div>
        <div class="heading">¥ 568.08</div>
      </el-col>
    </el-row>

    <el-card shadow="always" class="app-card" header="流程进度">
      <div style="padding: 0px 50px;">
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
    </el-card>

    <el-card shadow="always" class="app-card" header="用户信息">
      <detail-list>
        <detail-list-item term="用户姓名">付晓晓</detail-list-item>
        <detail-list-item term="会员卡号"
          >32943898021309809423</detail-list-item
        >
        <detail-list-item term="身份证">3321944288191034921</detail-list-item>
        <detail-list-item term="联系方式">18112345678</detail-list-item>
        <detail-list-item term="联系地址"
          >浙江省杭州市西湖区黄姑山路工专路交叉路口</detail-list-item
        >
      </detail-list>
      <detail-list title="信息组">
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
        <detail-list-item term="某某数据">725</detail-list-item>
        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>
        <detail-list-item>&nbsp;</detail-list-item>
      </detail-list>

      <el-card shadow="never" header="用户信息组">
        <detail-list title="组名称" size="small">
          <detail-list-item term="负责人">林东东</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
          <detail-list-item term="所属部门">XX公司-YY部</detail-list-item>
          <detail-list-item term="过期时间">2018-08-08</detail-list-item>
          <detail-list-item term="描述"
            >这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...</detail-list-item
          >
        </detail-list>
        <el-divider></el-divider>
        <detail-list title="组名称" size="small" :col="1">
          <detail-list-item term="学名">
            Citrullus lanatus (Thunb.) Matsum. et
            Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..</detail-list-item
          >
        </detail-list>
        <el-divider></el-divider>
        <detail-list title="组名称" size="small" :col="2">
          <detail-list-item term="负责人">付小小</detail-list-item>
          <detail-list-item term="角色码">1234567</detail-list-item>
        </detail-list>
      </el-card>
    </el-card>

    <el-card shadow="always" class="app-card" header="用户近半年来电记录">
      <div class="no-data"><i class="el-icon-warning-outline"></i>暂无数据</div>
    </el-card>

    <el-card class="app-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="操作日志一" name="first"
          ><div class="no-data">
            <i class="el-icon-warning-outline"></i>暂无数据
          </div></el-tab-pane
        >
        <el-tab-pane label="操作日志二" name="second"
          ><div class="no-data">
            <i class="el-icon-warning-outline"></i>暂无数据
          </div></el-tab-pane
        >
        <el-tab-pane label="操作日志三" name="third"
          ><div class="no-data">
            <i class="el-icon-warning-outline"></i>暂无数据
          </div></el-tab-pane
        >
      </el-tabs>
    </el-card>
  </page-header-layout>
</template>

<script>
import DetailList from 'components/DetailList';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
const DetailListItem = DetailList.Item;

import { mapState } from 'vuex';

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export default {
  components: {
    PageHeaderLayout,
    DetailList,
    DetailListItem
  },
  data() {
    return {
      directionType,
      activeName: 'second'
    };
  },
  computed: {
    ...mapState('app', ['device'])
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/variables.scss';

.detail-layout {
  margin-left: 44px;

  a {
    color: $--color-primary;
  }
}

.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  margin-top: 10px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .status-list {
    text-align: left;
  }
}
</style>
