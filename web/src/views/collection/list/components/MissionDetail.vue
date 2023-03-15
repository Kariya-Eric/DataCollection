<template>
  <div>
    <a-modal
      title="任务概览"
      v-model:visible="visible"
      @cancel="handleCancel"
      :footer="false"
      fullscreen
    >
      <a-space direction="vertical" size="large" fill>
        <a-descriptions
          :data="missionData"
          title="基本信息"
          align="left"
          layout="inline-horizontal"
        />
      </a-space>
      <a-divider />
      <a-typography>
        <a-typography-title
          :heading="6"
          style="margin-top: 12px; margin-bottom: 20px"
          >表单分配</a-typography-title
        >
        <a-table
          :columns="columns"
          :data="dataSource"
          :bordered="{ cell: true }"
          :pagination="false"
          :span-method="dataSpanMethod"
          :scroll="{ y: 500 }"
        />
      </a-typography>
    </a-modal>
  </div>
</template>

<script>
import { randomNumber, randomUUID, randomString } from '@/utils/util';

export default {
  name: 'MissionDetail',
  data() {
    return {
      missionId: '',
      visible: false,
      missionData: [],
      columns: [
        {
          title: '表单大类',
          align: 'center',
          dataIndex: 'formType',
        },
        {
          title: '表单名称',
          align: 'center',
          dataIndex: 'formName',
        },
        {
          title: '负责部门',
          align: 'center',
          dataIndex: 'depart',
        },
        {
          title: '协作部门',
          align: 'center',
          dataIndex: 'assistantDept',
        },
        {
          title: '统计截止时间',
          align: 'center',
          dataIndex: 'endTime',
        },
      ],
      dataSource: [],
    };
  },

  created() {
    this.initData();
  },

  methods: {
    show(info) {
      this.missionId = info.key;
      Object.entries(info).forEach((item) => {
        this.missionData.push({
          label: item[0],
          value: item[1],
        });
      });
      this.visible = true;
    },

    handleCancel() {
      this.visible = false;
    },

    dataSpanMethod({ rowIndex, columnIndex }) {
      const map = new Map();
      this.dataSource.forEach((item) => map.set(item.formType, 0));
      map.forEach((value, key) =>
        map.set(
          key,
          this.dataSource.filter((item) => item.formType === key).length
        )
      );
      if (rowIndex === 0 && columnIndex === 0) {
        return {
          rowspan: 10,
        };
      }
      if (rowIndex === 10 && columnIndex === 0) {
        return {
          rowspan: 2,
        };
      }
      return {};
    },

    initData() {
      for (let i = 0; i < 10; i += 1) {
        this.dataSource.push({
          key: randomUUID(),
          formType: `1.学校基本信息-1`,
          formName: `1-${i + 1} 学校信息-${randomString(5)}`,
          depart: 'XXX',
          assistantDept: 'XXX',
          endTime: `${randomNumber(2018, 2023)}-09-30`,
        });
      }
      for (let i = 0; i < 2; i += 1) {
        this.dataSource.push({
          key: randomUUID(),
          formType: `2.学校基本信息-2`,
          formName: `2-${i + 1} 学校信息-${randomString(5)}`,
          depart: 'XXX',
          assistantDept: 'XXX',
          endTime: `${randomNumber(2018, 2023)}-09-30`,
        });
      }
    },
  },
};
</script>

<style>
</style>