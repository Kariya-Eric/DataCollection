<template>
  <div class="modalDivSecond">
    <div class="table-page-search-wrapper">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-space>
            <span>表单合集：</span>
            <a-select>
              <a-option>状态数据表单</a-option>
              <a-option>其他数据表单</a-option>
            </a-select>
          </a-space>
        </a-col>
        <a-col :span="4" :offset="12">
          <a-button type="primary" @click="showEndTimeModal"
            >批量配置统计截止时间</a-button
          >
        </a-col>
      </a-row>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data="dataSource"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedKeys"
        :scroll="{ y: 600 }"
        bordered="true"
        :pagination="false"
      >
        <template #formStatus="{ record }">
          <a-tag size="large" color="green" bordered v-if="record.formStatus">
            可填报
          </a-tag>
          <a-tag size="large" color="orange" bordered v-else> 不可填报 </a-tag>
        </template>
        <template #action="{ record }">
          <a href="javascript:;" @click="showSingleEndTimeModal(record)"
            >配置统计截止时间</a
          >
          <a-divider direction="vertical" />
          <a v-if="record.formStatus" href="javascript:;" @click="apply(record)"
            >申请不可填报</a
          >
          <a-popconfirm
            v-else
            content="是否确认撤销不可填报?"
            type="warning"
            @ok="cancel(record)"
          >
            <a href="javascript:;">撤销不可填报</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <a-modal
      title="批量配置统计截止时间"
      @cancel="closeEndTimeModal"
      v-model:visible="endTimeModalVisible"
    >
      <a-form ref="endTimeForm" :model="endTimeForm">
        <a-form-item label="表单类型" field="formType">
          <a-select
            placeholder="请选择表单类型"
            v-model="endTimeForm.formType"
            multiple
            allow-clear
          >
            <a-option :key="item.key" v-for="item in dataSource">{{
              item.formName
            }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="统计截止时间" field="endTime">
          <a-date-picker style="width: 200px" v-model="endTimeForm.endTime" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="不填报原因"
      v-model:visible="applyModalVisible"
      @cancel="closeApplyModal"
    >
      <a-textarea
        placeholder="请输入不填报原因"
        v-model="applyReason"
        allow-clear
        show-word-limit
        :max-length="50"
      >
      </a-textarea>
    </a-modal>

    <a-modal
      title="统计截止时间"
      v-model:visible="singleEndTimeModalVisible"
      @cancel="closeSingleEndTimeModal"
    >
      <a-form ref="singleEndTimeForm" :model="singleEndTimeForm">
        <a-form-item label="表单名称" field="formName">
          <a-input disabled v-model="singleEndTimeForm.formName" />
        </a-form-item>
        <a-form-item label="统计截止时间" field="endTime">
          <a-date-picker
            style="width: 200px"
            v-model="singleEndTimeForm.endTime"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { randomNumber, randomUUID, randomString } from '@/utils/util';

  export default {
    name: 'AddMissionSecondStep',
    data() {
      return {
        applyReason: '',
        applyModalVisible: false,
        endTimeModalVisible: false,
        singleEndTimeModalVisible: false,
        singleEndTimeForm: {},
        endTimeForm: {},
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
        },
        selectedKeys: [],
        columns: [
          {
            title: '表单名称',
            align: 'center',
            dataIndex: 'formName',
          },
          {
            title: '状态',
            align: 'center',
            slotName: 'formStatus',
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'formRemark',
          },
          {
            title: '统计截止时间',
            align: 'center',
            sortable: {
              sortDirections: ['ascend', 'descend'],
            },
            dataIndex: 'endTime',
          },
          {
            title: '操作',
            slotName: 'action',
          },
        ],
        dataSource: [],
      };
    },

    created() {
      this.initData();
    },

    methods: {
      initData() {
        for (let i = 0; i < 20; i += 1) {
          this.dataSource.push({
            key: randomUUID(),
            formName: `1-${randomNumber(1, 9)} 表单名-${randomString(5)}`,
            formStatus: randomNumber(0, 1) === 0,
            formRemark: randomNumber(0, 1) === 0 ? '不可填报说明文字' : '-',
            endTime: `${randomNumber(2016, 2024)}-9-30`,
          });
        }
      },

      showEndTimeModal() {
        this.endTimeModalVisible = true;
      },

      closeEndTimeModal() {
        this.$refs.endTimeForm.resetFields();
        this.endTimeModalVisible = false;
      },

      apply(record) {
        this.applyReason = '';
        this.applyModalVisible = true;
      },

      cancel(record) {},

      closeApplyModal() {
        this.applyModalVisible = false;
      },

      closeSingleEndTimeModal() {
        this.singleEndTimeModalVisible = false;
      },

      showSingleEndTimeModal(record) {
        this.singleEndTimeModalVisible = true;
      },
    },
  };
</script>

<style></style>
