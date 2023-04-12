<template>
  <page-header-layout title="基础详情页">
    <el-card shadow="always" class="app-card">
      <div style="padding: 24px 12px 24px 12px;">
        <detail-list title="退款申请">
          <detail-list-item term="取货单号">1000000000</detail-list-item>
          <detail-list-item term="状态">已取货</detail-list-item>
          <detail-list-item term="销售单号">1234123421</detail-list-item>
          <detail-list-item term="子订单">3214321432</detail-list-item>
        </detail-list>
        <el-divider style="margin-bottom: 32px" />
        <detail-list title="用户信息">
          <detail-list-item term="用户姓名">付小小</detail-list-item>
          <detail-list-item term="联系电话">18100000000</detail-list-item>
          <detail-list-item term="常用快递">菜鸟仓储</detail-list-item>
          <detail-list-item term="取货地址">浙江省杭州市西湖区万塘路18号</detail-list-item>
          <detail-list-item term="备注">	无</detail-list-item>
        </detail-list>
        <el-divider style="margin-bottom: 32px" />

        <div class="title">退货商品</div>
        <el-table
          v-loading="isLoadingGoods"
          :data="listGoodsData"
          fit
          highlight-current-row
          style="width: 100%; margin-bottom: 32px"
          size="medium"
        >
          <el-table-column
            prop="id"
            label="商品编号"
          />
          <el-table-column
            prop="name"
            label="商品名称"
          />
          <el-table-column
            prop="barcode"
            label="商品条码"
          />
          <el-table-column
            prop="price"
            label="单价"
          />
          <el-table-column
            prop="num"
            label="数量（件）"
          />
          <el-table-column
            prop="amount"
            label="金额"
          />
        </el-table>

        <div class="title">退货进度</div>
        <el-table
          v-loading="isLoadingSchedule"
          :data="listScheduleData"
          fit
          highlight-current-row
          style="width: 100%"
          size="medium"
        >
          <el-table-column
            prop="time"
            label="时间"
          />
          <el-table-column
            prop="rate"
            label="当前进度"
          />
          <el-table-column
            prop="status"
            label="状态"
          />
          <el-table-column
            prop="operator"
            label="操作员ID"
          />
          <el-table-column
            prop="cost"
            label="耗时"
          />
        </el-table>
      </div>
    </el-card>
  </page-header-layout>
</template>

<script>
// import STable from '@/components/table/';
import DetailList from 'components/DetailList';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
const DetailListItem = DetailList.Item;

export default {
  components: {
    PageHeaderLayout,
    DetailList,
    DetailListItem
    // STable
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'processing': '进行中',
        'success': '完成',
        'failed': '失败'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      listGoodsData: null,
      isLoadingGoods: true,

      listScheduleData: null,
      isLoadingSchedule: true,

      goodsColumns: [
        {
          title: '商品编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '商品条码',
          dataIndex: 'barcode',
          key: 'barcode'
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
          align: 'right'
        },
        {
          title: '数量（件）',
          dataIndex: 'num',
          key: 'num',
          align: 'right'
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right'
        }
      ],

      scheduleColumns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '当前进度',
          dataIndex: 'rate',
          key: 'rate'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作员ID',
          dataIndex: 'operator',
          key: 'operator'
        },
        {
          title: '耗时',
          dataIndex: 'cost',
          key: 'cost'
        }
      ]
    };
  },
  computed: {
    title() {
      return this.$route.meta.title;
    }
  },
  created() {
    this.isLoadingGoods = true;
    this.loadGoodsData()
      .then(response => {
        console.log(response);
        this.listGoodsData = response.data;
        this.total = response.totalCount;
        this.totalPages = response.totalPage;
        this.isLoadingGoods = false;
      })
      .catch();
    this.loadScheduleData()
      .then(response => {
        console.log(response);
        this.listScheduleData = response.data;
        this.total = response.totalCount;
        this.totalPages = response.totalPage;
        this.isLoadingSchedule = false;
      })
      .catch();
  },
  methods: {
    // 加载数据方法
    loadGoodsData() {
      return new Promise(resolve => {
        resolve({
          data: [
            {
              id: '1234561',
              name: '矿泉水 550ml',
              barcode: '12421432143214321',
              price: '2.00',
              num: '1',
              amount: '2.00'
            },
            {
              id: '1234562',
              name: '凉茶 300ml',
              barcode: '12421432143214322',
              price: '3.00',
              num: '2',
              amount: '6.00'
            },
            {
              id: '1234563',
              name: '好吃的薯片',
              barcode: '12421432143214323',
              price: '7.00',
              num: '4',
              amount: '28.00'
            },
            {
              id: '1234564',
              name: '特别好吃的蛋卷',
              barcode: '12421432143214324',
              price: '8.50',
              num: '3',
              amount: '25.50'
            }
          ],
          pageSize: 10,
          pageNo: 1,
          totalPage: 1,
          totalCount: 10
        });
      }).then(res => {
        return res;
      });
    },
    loadScheduleData() {
      return new Promise(resolve => {
        resolve({
          data: [
            {
              key: '1',
              time: '2017-10-01 14:10',
              rate: '联系客户',
              status: 'processing',
              operator: '取货员 ID1234',
              cost: '5mins'
            },
            {
              key: '2',
              time: '2017-10-01 14:05',
              rate: '取货员出发',
              status: 'success',
              operator: '取货员 ID1234',
              cost: '1h'
            },
            {
              key: '3',
              time: '2017-10-01 13:05',
              rate: '取货员接单',
              status: 'success',
              operator: '取货员 ID1234',
              cost: '5mins'
            },
            {
              key: '4',
              time: '2017-10-01 13:00',
              rate: '申请审批通过',
              status: 'success',
              operator: '系统',
              cost: '1h'
            },
            {
              key: '5',
              time: '2017-10-01 12:00',
              rate: '发起退货申请',
              status: 'success',
              operator: '用户',
              cost: '5mins'
            }
          ],
          pageSize: 10,
          pageNo: 1,
          totalPage: 1,
          totalCount: 10
        });
      }).then(res => {
        return res;
      });
    }
  }

};
</script>

<style lang="scss" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin: 16px 0px;
  }
</style>
