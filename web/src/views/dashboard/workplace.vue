<template>
  <page-header-layout :avatar="avatar" title="Workplace">
    <div slot="headerContent">
      <div class="title">
        {{ timeFix }}，{{ userInfo.username
        }}<span class="welcome-text">，{{ welcome }}</span>
      </div>
      <div>混子</div>
    </div>
    <div slot="extra">
      <el-row class="more-info">
        <el-col :span="8">
          <head-info
            title="项目"
            content="56"
            :center="true"
            :bordered="true"
          />
        </el-col>
        <el-col :span="8">
          <head-info
            title="团队排名"
            content="8/24"
            :center="true"
            :bordered="true"
          />
        </el-col>
        <el-col :span="8">
          <head-info title="项目数" content="2,223" :center="true" />
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="24">
      <el-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card
          shadow="always"
          class="app-card project-list"
          :body-style="{ padding: 0 }"
        >
          <div slot="header">
            <el-row>
              <el-col :md="12" :sm="24"><span>进行中的项目</span></el-col>
              <el-col :md="12" :sm="24">
                <div style="float: right">
                  <a>全部项目</a>
                </div>
              </el-col>
            </el-row>
          </div>

          <div>
            <el-row>
              <el-col
                :md="8"
                :sm="24"
                v-for="(item, index) in projects"
                :key="index"
              >
                <el-card shadow="hover">
                  <div class="card-title">
                    <el-avatar size="small" :src="item.avatar" />
                    <a>{{ item.title }}</a>
                  </div>
                  <div class="card-description">
                    {{ item.content }}
                  </div>
                  <el-row>
                    <div class="project-item">
                      <a href="/#/">科学搬砖组</a>
                      <span class="datetime">9小时前</span>
                    </div>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card shadow="always" class="app-card">
          <div slot="header">
            <span>动态</span>
          </div>

          <!-- Table Start -->
          <el-table
            ref="multipleTable"
            :key="tableKey"
            v-loading="isLoading"
            :data="activities"
            style="width: 100%"
            size="medium"
            :show-header="false"
            fit
          >
            <el-table-column width="80">
              <template v-slot="scope">
                <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column>
              <template v-slot="scope">
                <el-row>
                  <div>
                    <span>{{ scope.row.nickname }}</span
                    >&nbsp;在&nbsp;<a href="#">{{ scope.row.project.name }}</a
                    >&nbsp;&nbsp; <span>{{ scope.row.project.action }}</span
                    >&nbsp;
                    <a href="#">{{ scope.row.project.event }}</a>
                  </div>
                  <div></div>
                </el-row>
                <el-row>
                  <span>{{ scope.row.time.toLocaleString() }}</span>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <!-- Table End -->
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card shadow="always" class="app-card">
          <div slot="header"><span>快速开始 / 便捷导航</span></div>
          <div class="item-group">
            <a>操作一</a>
            <a>操作二</a>
            <a>操作三</a>
            <a>操作四</a>
            <a>操作五</a>
            <a>操作六</a>
            <el-button size="small" type="primary" class="el-icon-plus" plain
              >添加
            </el-button>
          </div>
        </el-card>
        <el-card shadow="always" class="app-card">
          <div slot="header"><span>XX 指数</span></div>
          <div>
            <pie-chart
              :chartData="sourceData"
              :gridLeft="50"
              height="430px"
              title="销售额"
            ></pie-chart>
          </div>
        </el-card>
        <el-card shadow="always" class="app-card">
          <div slot="header"><span>团队</span></div>
          <div class="members">
            <el-row>
              <el-col :span="12" v-for="(item, index) in teams" :key="index">
                <a>
                  <el-avatar size="small" :src="item.avatar" />
                  <span class="member">{{ item.name }}</span>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </page-header-layout>
</template>

<script>
import { timeFix } from "@/utils";
import PageHeaderLayout from "layouts/PageHeaderLayout";
import HeadInfo from "components/tools/HeadInfo";
import { mapState } from "vuex";
import PieChart from "components/ECharts/PieChart";

const projectsData = [];
for (let i = 0; i < 6; i++) {
  projectsData.push({
    title: "Alipay",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    content: "那是一种内在的东西， 他们到达不了，也无法触及的",
  });
}

const activitiesData = [];
for (let i = 0; i < 8; i++) {
  activitiesData.push({
    nickname: "曲丽丽",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
    time: new Date(),
    project: {
      name: "白鹭酱油开发组 ",
      action: "更新",
      event: "番组计划",
    },
  });
}

const sourceData = [
  { name: "家用电器", value: 32.2 },
  { name: "食用酒水", value: 21 },
  { name: "个护健康", value: 17 },
  { name: "服饰箱包", value: 13 },
  { name: "母婴产品", value: 9 },
  { name: "其他", value: 7.8 },
];

const teamsData = [
  {
    name: "科学搬砖组",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  },
  {
    name: "程序员日常",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png",
  },
  {
    name: "设计天团",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png",
  },
  {
    name: "中二少女团",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png",
  },
  {
    name: "骗你学计算机",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png",
  },
];

export default {
  name: "Workplace",
  components: {
    PageHeaderLayout,
    HeadInfo,
    PieChart,
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: require("@/assets/images/avatar.jpg"),

      sourceData,
      isLoading: false,
      tableKey: 0,
      projects: [],
      activities: [],
      teams: [],
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  created() {
    this.welcome = "要不要打一把Dota";
  },
  mounted() {
    this.getProjects();
    this.getActivities();
    this.getTeams();
  },
  methods: {
    getProjects() {
      this.projects = projectsData;
    },
    getActivities() {
      this.activities = activitiesData;
    },
    getTeams() {
      this.teams = teamsData;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: $--color-primary;
      }
    }
  }
  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
    margin-top: 12px;
  }
  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: $--color-primary;
      }
    }
    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: $--color-primary;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
