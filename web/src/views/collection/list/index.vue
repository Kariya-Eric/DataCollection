<template>
  <div class="container" style="margin: 12px 12px 0px">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :layout="inline" ref="searchForm" :model="queryParam">
          <a-row :gutter="24">
            <a-col :md="6" :sm="4">
              <a-form-item label="任务类型">
                <a-select
                  placeholder="请选择任务类型"
                  v-model="queryParam.missionType"
                >
                  <a-option>全部</a-option>
                  <a-option>教学基本状态数据</a-option>
                  <a-option>其他数据</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="4">
              <a-form-item label="学年">
                <a-select
                  placeholder="请选择学年"
                  v-model="queryParam.studyYear"
                >
                  <a-option>2021-2022</a-option>
                  <a-option>2020-2021</a-option>
                  <a-option>2019-2020</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="4">
              <a-form-item label="任务名称">
                <a-input
                  placeholder="输入任务名称模糊匹配"
                  v-model="queryParam.missionName"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="4">
              <span style="float: left; overflow: hidden">
                <a-button type="primary" @click="search">
                  <template #icon>
                    <icon-search />
                  </template>
                  <template #default>查询</template>
                </a-button>
                <a-button
                  type="primary"
                  style="margin-left: 8px"
                  @click="searchReset"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                  <template #default>重置</template>
                </a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作区域 -->
      <div class="table-operator" style="border-top: 5px">
        <a-button type="primary" @click="addMission">
          <template #icon>
            <icon-plus />
          </template>
          <template #default>添加任务</template>
        </a-button>

        <a-upload action="/">
          <template #upload-button>
            <a-button type="primary">
              <template #icon>
                <icon-upload />
              </template>
              <template #default>上传</template></a-button
            >
          </template>
        </a-upload>

        <a href="javascript:;">下载导入模板</a>
      </div>
      <!-- table区域 -->
      <div>
        <a-table
          :columns="columns"
          :data="dataSource"
          :pagination="ipagination"
          :bordered="{ cell: true }"
        >
          <template #enabled="{ record }">
            <a-switch v-model="record.enabled" />
          </template>
          <template #progress="{ record }">
            <a-progress :percent="record.progress" />
          </template>
          <template #missionStatus="{ record }">
            <a-tag
              size="large"
              checkable
              color="gray"
              bordered
              v-if="record.missionStatus === 0"
            >
              未启用
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="blue"
              bordered
              v-if="record.missionStatus === 1"
            >
              启用中
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="green"
              bordered
              v-if="record.missionStatus === 2"
            >
              完成
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="orange"
              bordered
              v-if="record.missionStatus === 3"
            >
              停用
            </a-tag>
          </template>
          <template #action="{ record }">
            <a href="javascript:;">任务概览</a>
            <a-divider v-if="record.enabled" direction="vertical" />
            <a v-if="record.enabled" href="javascript:;">任务详情</a>
            <a-divider direction="vertical" />
            <a href="javascript:;">删除</a>
            <a-divider v-if="record.enabled" direction="vertical" />
            <a v-if="record.enabled" href="javascript:;">指南下载</a>
            <a-divider v-if="record.enabled" direction="vertical" />
            <a v-if="record.enabled" href="javascript:;">模板下载</a>
            <a-divider v-if="record.enabled" direction="vertical" />
            <a v-if="record.enabled" href="javascript:;">预览报告</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <add-mission-modal ref="addMission" />
  </div>
</template>

<script lang="ts" setup></script>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixin';
import { randomNumber, randomUUID } from '@/utils/util';
import AddMissionModal from './components/AddMissionModal.vue';

export default {
  name: 'DataCollectionList',
  components: { AddMissionModal },
  mixins: [DataCollectionMixin],

  data() {
    return {
      columns: [
        {
          title: '任务类型',
          align: 'center',
          dataIndex: 'missonType',
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'missionName',
        },
        {
          title: '统计开始时间',
          align: 'center',
          dataIndex: 'startTime',
          sortable: {
            sortDirections: ['ascend', 'descend'],
          },
        },
        {
          title: '统计截止时间',
          align: 'center',
          dataIndex: 'endTime',
          sortable: {
            sortDirections: ['ascend', 'descend'],
          },
        },
        {
          title: '学年',
          align: 'center',
          dataIndex: 'studyYear',
        },
        {
          title: '自然年',
          align: 'center',
          dataIndex: 'naturalYear',
        },
        {
          title: '任务状态',
          align: 'center',
          slotName: 'missionStatus',
        },
        {
          title: '完成进度',
          width: '120',
          slotName: 'progress',
        },
        {
          title: '启用',
          slotName: 'enabled',
        },
        {
          title: '操作',
          slotName: 'action',
        },
      ],
    };
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      for (let i = 0; i < 50; i += 1) {
        this.dataSource.push({
          key: randomUUID(),
          missonType: '教学基本状态数据',
          missionName: `${randomNumber(2016, 2024)}教学基本状态数据`,
          startTime: `${randomNumber(2016, 2024)}-9-1`,
          endTime: `${randomNumber(2016, 2024)}-9-30`,
          studyYear: randomNumber(2016, 2024),
          naturalYear: `${randomNumber(2016, 2024)}-${randomNumber(
            2016,
            2024
          )}`,
          missionStatus: randomNumber(0, 3),
          progress: randomNumber(0, 100) / 100,
          enabled: randomNumber(0, 1) === 0,
        });
      }
    },

    addMission() {
      this.$refs.addMission.show();
    },

    search() {
      console.log('表单数据', this.$refs.searchForm, this.queryParam);
    },
  },
};
</script>

<style scoped>
</style>
