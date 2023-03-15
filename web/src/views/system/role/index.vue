<template>
  <div class="container" style="margin: 12px 12px 0px">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :layout="inline" ref="userForm" :model="queryParam">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="角色名">
                <a-input v-model="queryParam.name" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="部门ID">
                <a-select v-model="queryParam.enabled">
                  <a-option value="1">启用</a-option>
                  <a-option value="0">禁用</a-option>
                </a-select>
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
          <a-button type="primary" @click="addRole">
            <icon-plus />新建角色
          </a-button>
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
          <template #enabled="{ record }"
            ><a-tag
              size="large"
              color="gray"
              bordered
              v-if="record.enabled === 0"
            >
              禁用
            </a-tag>
            <a-tag
              size="large"
              color="green"
              bordered
              v-if="record.enabled === 1"
            >
              启用
            </a-tag>
          </template>
          <template #action="{ record }">
            <a href="javascript:;" @click="show(record)">详情</a>
            <a-divider direction="vertical" />
            <a href="javascript:;">编辑</a>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { DataCollectionMixin } from '@/mixins/DataCollectionMixin';

  export default {
    name: 'SystemRole',
    mixins: [DataCollectionMixin],
    data() {
      return {
        columns: [
          {
            title: '角色名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '角色编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '更新时间',
            align: 'center',
            dataIndex: 'updateTime',
            sortable: {
              sortDirections: ['ascend', 'descend'],
            },
          },
          {
            title: '状态',
            align: 'center',
            slotName: 'enabled',
          },
          {
            title: '操作',
            align: 'center',
            slotName: 'action',
          },
        ],
      };
    },
    methods: {
      show(record) {
        console.log(record);
      },
    },
  };
</script>

<style></style>
