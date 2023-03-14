<template>
  <div class="modalDivThird">
    <a-layout>
      <a-layout-sider :width="240">
        <div>
          <a-input-search
            style="margin-bottom: 8px; max-width: 240px"
            v-model="searchKey"
            placeholder="输入负责部门名称"
          />
          <a-tree :data="treeData">
            <template #title="nodeData">
              <template
                v-if="((index = getMatchIndex(nodeData?.title)), index < 0)"
                >{{ nodeData?.title }}</template
              >
              <span v-else>
                {{ nodeData?.title?.substr(0, index) }}
                <span style="color: var(--color-primary-light-4)">
                  {{ nodeData?.title?.substr(index, searchKey.length) }} </span
                >{{ nodeData?.title?.substr(index + searchKey.length) }}
              </span>
            </template></a-tree
          >
        </div>
      </a-layout-sider>
      <a-divider direction="vertical" :size="200" />
      <a-layout-content>
        <div class="table-page-search-wrapper" style="margin-top: 0px;">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-space>
                <span>权限配置合集：</span>
                <a-select>
                  <a-option>全部</a-option>
                  <a-option>未配置</a-option>
                  <a-option>已配置</a-option>
                </a-select>
              </a-space>
            </a-col>
            <a-col :span="4" :offset="11">
              <a-space>
                <a-button type="primary">复制其他任务权限</a-button>
                <a-button type="primary">批量配置权限</a-button>
              </a-space>
            </a-col>
          </a-row>
        </div>
        <div>
          <a-table
            :columns="columns"
            :data="dataSource"
            :scroll="{ y: 600 }"
            bordered="true"
            :pagination="false"
          >
            <template #status="{ record }">
              <a-tag size="large" color="green" bordered v-if="record.status">
                已配置
              </a-tag>
              <a-tag size="large" color="orange" bordered v-else>
                未配置
              </a-tag>
            </template>
            <template #action="{ record }">
              <a href="javascript:;" @click="handlePermission(record)"
                >配置权限</a
              >
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
  import { randomNumber, randomUUID, randomString } from '@/utils/util';

  export default {
    name: 'AddMissionThirdStep',
    data() {
      return {
        searchKey: '',
        orginTreeData: [
          {
            title: 'XXX学校',
            key: 'XXX学校',
            children: [
              {
                title: '职能部门',
                key: '职能部门',
                children: [
                  { title: '人事部', key: '人事部' },
                  { title: '后保部', key: '后保部' },
                  { title: '发展规划处', key: '发展规划处' },
                  { title: '校团委', key: '校团委' },
                  { title: '师生服务中心', key: '师生服务中心' },
                  { title: '对外合作交流处', key: '对外合作交流处' },
                  { title: '教务处', key: '教务处' },
                ],
              },
              {
                title: '教学部门',
                key: '教学部门',
                children: [
                  { title: '经济管理学院', key: '经济管理学院' },
                  { title: '体育学院', key: '体育学院' },
                  { title: '商学院', key: '商学院' },
                  { title: '生命学院', key: '生命学院' },
                  { title: '土木和水利工程学院', key: '土木和水利工程学院' },
                  { title: '外国语学院', key: '外国语学院' },
                  { title: '信息工程学院', key: '信息工程学院' },
                  { title: '新闻传播学院', key: '新闻传播学院' },
                ],
              },
            ],
          },
        ],
        columns: [
          {
            title: '表单名称',
            align: 'center',
            dataIndex: 'formName',
          },
          {
            title: '权限配置状态',
            align: 'center',
            slotName: 'status',
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
            title: '操作',
            align: 'center',
            slotName: 'action',
          },
        ],
        dataSource: [],
      };
    },
    created() {
      this.initData();
    },
    computed: {
      treeData() {
        if (!this.searchKey) return this.orginTreeData;
        return this.searchData(this.searchKey);
      },
    },
    methods: {
      initData() {
        for (let i = 0; i < 20; i += 1) {
          this.dataSource.push({
            key: randomUUID(),
            formName: `1-${randomNumber(1, 9)} 表单名-${randomString(5)}`,
            status: randomNumber(0, 1) === 0,
            depart: `教务处-${randomString(5)}`,
            assistantDept: `人事处-${randomString(5)}`,
          });
        }
      },
      getMatchIndex(title) {
        if (!this.searchKey.value) return -1;
        return title.toLowerCase().indexOf(this.searchKey.value.toLowerCase());
      },

      searchData(keyword) {
        console.log(keyword);
        const loop = (data) => {
          const result = [];
          data.forEach((item) => {
            if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              result.push({ ...item });
            } else if (item.children) {
              const filterData = loop(item.children);
              if (filterData.length) {
                result.push({
                  ...item,
                  children: filterData,
                });
              }
            }
          });
          return result;
        };
        return loop(this.originTreeData);
      },

      handlePermission(record) {},
    },
  };
</script>

<style></style>
