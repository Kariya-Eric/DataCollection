<template>
  <div class="container" style="margin: 12px 12px 0px">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :layout="inline" ref="searchForm" :model="queryParam">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="任务类型">
                <a-select
                  placeholder="请选择任务类型"
                  v-model="queryParam.type"
                >
                  <a-option>全部</a-option>
                  <a-option>教学基本状态数据</a-option>
                  <a-option>其他数据</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="学年">
                <a-select
                  placeholder="请选择学年"
                  v-model="queryParam.schoolYear"
                >
                  <a-option>2021-2022</a-option>
                  <a-option>2020-2021</a-option>
                  <a-option>2019-2020</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="任务名称">
                <a-input
                  placeholder="输入任务名称模糊匹配"
                  v-model="queryParam.name"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-space>
                <a-button type="primary" @click="search">
                  <icon-search />查询
                </a-button>
                <a-button type="primary" @click="searchReset">
                  <icon-delete /> 重置
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作区域 -->
      <div class="table-operator" style="border-top: 5px">
        <a-space>
          <a-button type="primary" @click="addMission">
            <icon-plus />添加任务
          </a-button>

          <a-upload action="/">
            <template #upload-button>
              <a-button type="primary"> <icon-upload />上传</a-button>
            </template>
          </a-upload>

          <a href="javascript:;">下载导入模板</a>
        </a-space>
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
          <template #percentage="{ record }">
            <a-progress :percent="record.percentage" />
          </template>
          <template #status="{ record }">
            <a-tag
              size="large"
              checkable
              color="gray"
              bordered
              v-if="record.status === 0"
            >
              未启用
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="blue"
              bordered
              v-if="record.status === 1"
            >
              启用中
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="green"
              bordered
              v-if="record.status === 2"
            >
              完成
            </a-tag>
            <a-tag
              size="large"
              checkable
              color="orange"
              bordered
              v-if="record.status === 3"
            >
              停用
            </a-tag>
          </template>
          <template #action="{ record }">
            <a href="javascript:;" @click="showMissionDetail(record)"
              >任务概览</a
            >
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
    <mission-detail ref="missionDetail" />
  </div>
</template>

<script lang="ts" setup></script>

<script>
  import { DataCollectionMixin } from '@/mixins/DataCollectionMixin';
  import { randomNumber, randomUUID } from '@/utils/util';
  import AddMissionModal from './components/AddMissionModal.vue';
  import MissionDetail from './components/MissionDetail.vue';

  export default {
    name: 'DataCollectionList',
    components: { AddMissionModal, MissionDetail },
    mixins: [DataCollectionMixin],

    data() {
      return {
        columns: [
          {
            title: '任务类型',
            align: 'center',
            dataIndex: 'type',
          },
          {
            title: '任务名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '统计开始时间',
            align: 'center',
            dataIndex: 'statisticsStartTime',
            sortable: {
              sortDirections: ['ascend', 'descend'],
            },
          },
          {
            title: '统计截止时间',
            align: 'center',
            dataIndex: 'statisticsEndTime',
            sortable: {
              sortDirections: ['ascend', 'descend'],
            },
          },
          {
            title: '学年',
            align: 'center',
            dataIndex: 'schoolYear',
          },
          {
            title: '自然年',
            align: 'center',
            dataIndex: 'year',
          },
          {
            title: '任务状态',
            align: 'center',
            slotName: 'status',
          },
          {
            title: '完成进度',
            width: '120',
            slotName: 'percentage',
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

    methods: {
      addMission() {
        this.$refs.addMission.show();
      },

      search() {
        console.log('表单数据', this.$refs.searchForm, this.queryParam);
      },

      showMissionDetail(record) {
        this.$refs.missionDetail.show(record);
      },
    },
  };
</script>

<style lang="less" scoped></style>
