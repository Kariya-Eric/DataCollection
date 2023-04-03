<template>
  <div class="app-content">
    <el-row :gutter="32" class="therow">
      <el-col :md="6" :sm="24">
        <chart-card title="总销售额" total="￥126,560">
          <el-tooltip content="指标说明" slot="action" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <div style="position: absolute; bottom: 0; width: 100%;">
            <span style="padding-right: 10px;"
              >周同比12%<i
                class="el-icon-caret-top"
                style="color: red;"
              ></i></span
            ><span
              >日同比11%<i
                class="el-icon-caret-bottom"
                style="color: green;"
              ></i
            ></span>
          </div>
          <template slot="footer">
            日均销售额<span>￥ 234.56</span>
          </template>
        </chart-card>
      </el-col>
      <el-col :md="6" :sm="24">
        <chart-card title="访问量" :total="8846 | NumberFormat">
          <el-tooltip content="指标说明" slot="action" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <div>
            <single-line-chart
              :xData="xData"
              :yData="yData"
              height="80%"
              :isShowXAsix="false"
              :isShowYAsix="false"
              axisPointerType="none"
            ></single-line-chart>
          </div>
          <template slot="footer">
            日访问量<span> {{ "1234" | NumberFormat }}</span>
          </template>
        </chart-card>
      </el-col>
      <el-col :md="6" :sm="24">
        <chart-card title="支付笔数" :total="6560 | NumberFormat">
          <el-tooltip content="指标说明" slot="action" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <div>
            <single-bar-chart
              :xData="xData"
              :yData="yData"
              height="80%"
              :isShowXAsix="false"
              :isShowYAsix="false"
              axisPointerType="none"
            ></single-bar-chart>
          </div>
          <template slot="footer">
            转化率 <span>60%</span>
          </template>
        </chart-card>
      </el-col>
      <el-col :md="6" :sm="24">
        <chart-card title="运营活动效果" total="78%">
          <el-tooltip content="指标说明" slot="action" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <div style="position: absolute; bottom: 0; width: 100%;">
            <el-progress :percentage="78" :show-text="false"></el-progress>
          </div>
          <template slot="footer">
            <div>
              <span style="padding-right: 10px;"
                >周同比12%<i
                  class="el-icon-caret-top"
                  style="color: red;"
                ></i></span
              ><span
                >日同比11%<i
                  class="el-icon-caret-bottom"
                  style="color: green;"
                ></i
              ></span>
            </div>
          </template>
        </chart-card>
      </el-col>
    </el-row>
    <el-card shadow="always" class="app-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="销售额" name="first" :lazy="true">
          <el-row>
            <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <single-bar-chart
                :xData="xData"
                :yData="yData"
                :gridLeft="50"
                title="销售额排行"
              ></single-bar-chart>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list title="门店销售排行榜" :list="rankList" />
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="访问量" name="second" :lazy="true">
          <el-row>
            <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <single-bar-chart
                :xData="xData"
                :yData="yData"
                :gridLeft="50"
                width="100%"
                title="销售额趋势"
              ></single-bar-chart>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list title="门店销售排行榜" :list="rankList" />
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-row :gutter="24">
      <el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card shadow="always" class="app-card">
          <div slot="header">
            <el-row>
              <el-col :md="12" :sm="24"><span>线上热门搜索</span></el-col>
              <el-col :md="12" :sm="24">
                <div style="float: right;">
                  <el-dropdown trigger="click">
                    <el-button type="text" size="mini">...</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>操作一</el-dropdown-item>
                      <el-dropdown-item>操作二</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="38">
            <el-col :xl="12" :lg="24">
              <div style="color: rgba(0, 0, 0, 0.65);">
                <span>搜索用户数</span>
                <el-tooltip content="指标说明" slot="action" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div><span class="number-card-total">12321</span></div>
              <div>
                <single-line-chart
                  :xData="xData"
                  :yData="yData"
                  height="80%"
                  :isShowXAsix="false"
                  :isShowYAsix="false"
                  axisPointerType="none"
                ></single-line-chart>
              </div>
            </el-col>
            <el-col :xl="12" :lg="24">
              <div style="color: rgba(0, 0, 0, 0.65);">
                <span>人均搜索次数</span>
                <el-tooltip content="指标说明" slot="action" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div><span class="number-card-total">2.7</span></div>
              <div>
                <single-line-chart
                  :xData="xData"
                  :yData="yData"
                  height="80%"
                  :isShowXAsix="false"
                  :isShowYAsix="false"
                  axisPointerType="none"
                ></single-line-chart>
              </div>
            </el-col>
          </el-row>

          <div>
            <el-table
              ref="multipleTable"
              :data="searchData"
              style="width: 100%;"
              size="mini"
              fit
            >
              <el-table-column prop="index" label="排名" width="80">
              </el-table-column>
              <el-table-column prop="keyword" label="搜索关键词">
              </el-table-column>
              <el-table-column prop="count" label="用户数"> </el-table-column>
              <el-table-column label="周涨幅" width="100" sortable align="right">
                <template v-slot="scope">
                  <span>{{ scope.row.range }}%</span>
                  <span><i :class="scope.row.status | statusCaretFilter" :style="scope.row.status | statusCaretColorFilter"></i></span>
                </template>
              </el-table-column>
            </el-table>

            <div style="float: right;">
              <pagination
                :total="1000"
                layout=" prev, pager, next"
                :background="true"
                :small="true"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <el-card shadow="always" class="app-card" style="height: 540px;">
          <div slot="header">
            <el-row>
              <el-col :md="12" :sm="24"><span>销售额类别占比</span></el-col>
              <el-col :md="12" :sm="24">
                <div style="float: right;">
                  <el-radio-group
                    size="mini"
                    v-model="radio1"
                    style="margin-right: 10px;"
                  >
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线上"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                  </el-radio-group>
                  <el-dropdown trigger="click">
                    <el-button type="text" size="mini">...</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>操作一</el-dropdown-item>
                      <el-dropdown-item>操作二</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <pie-chart
              :chartData="sourceData"
              :gridLeft="50"
              height="430px"
              title="销售额"
            ></pie-chart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChartCard from './components/chartcard.vue';
import SingleLineChart from 'components/ECharts/SingleLineChart';
import SingleBarChart from 'components/ECharts/SingleBarChart';
import PieChart from 'components/ECharts/PieChart';
import RankList from 'components/tools/RankList';
import Pagination from 'components/Pagination';
import { mapState } from 'vuex';

import moment from 'moment';
// const lineData = [];
const xData = [];
const yData = [];
const beginDay = new Date().getTime();

for (let i = 0; i < 10; i++) {
  xData.push(
    moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD')
  );
  yData.push(Math.round((Math.random() + 1) * 10));
}

const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  });
}

const searchData = [];
for (let i = 0; i < 5; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor(Math.random() * 10 % 2)
  });
}

const sourceData = [
  { name: '家用电器', value: 32.2 },
  { name: '食用酒水', value: 21 },
  { name: '个护健康', value: 17 },
  { name: '服饰箱包', value: 13 },
  { name: '母婴产品', value: 9 },
  { name: '其他', value: 7.8 }
];

// el-icon-caret-top
export default {
  name: 'Dashboard',
  components: {
    Pagination,
    ChartCard,
    SingleLineChart,
    SingleBarChart,
    PieChart,
    RankList
  },
  filters: {
    statusCaretFilter(status) {
      return status === 1 ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
    },
    statusCaretColorFilter(status) {
      return status === 1 ? 'color: red;' : 'color: green';
    }
  },
  data() {
    return {
      xData,
      yData,
      rankList,
      searchData,
      sourceData,
      activeName: 'first',
      radio1: '全部渠道'
    };
  },
  computed: {
    ...mapState('user', ['userInfo', 'roles'])
  },
  created() {
    console.log('created');
  },
  mounted() {
    console.log(this.lineData);
  },
  methods: {
    handleClick() {
      // console.log(this.activeName);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.therow {
  .el-col {
    margin-bottom: 24px;
  }
}

.number-card-total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 22px;
  line-height: 40px;
  height: 40px;
}
</style>
