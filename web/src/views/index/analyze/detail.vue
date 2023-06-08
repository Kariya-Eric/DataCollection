<template>
  <div>
    <el-card shadow="always" style="margin-bottom: 8px">
      <!-- Query Start -->
      <el-row class="search-row" style="margin-bottom: 0px">
        <el-col :span="22">
          <div class="filter-container">
            <el-form label-width="70px" size="small" :inline="true">
              <el-form-item label="年份">
                <el-select
                  v-model="queryParam.year"
                  placeholder="请选择"
                  @change="searchQuery"
                >
                  <el-option label="2022" value="2022" />
                  <el-option label="2021" value="2021" />
                  <el-option label="2020" value="2020" />
                </el-select>
              </el-form-item>
              <el-form-item label="报告类型">
                <el-select
                  v-model="queryParam.type"
                  placeholder="请选择"
                  @change="searchQuery"
                >
                  <el-option
                    label="本科教学状态数据分析报告"
                    value="本科教学状态数据分析报告"
                  />
                  <el-option
                    label="本科教学质量报告"
                    value="本科教学质量报告"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="search-button-admin">
            <el-button type="primary" size="small">导出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- Query End -->
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card shadow="always">
          <el-input
            placeholder="输入目录名称进行过滤"
            v-model="categoryFilter"
            clearable
            size="small"
            prefix-icon="el-icon-search"
          />
          <el-tree
            class="filter-tree"
            :data="categoryList"
            :props="categoryProps"
            :filter-node-method="filterNode"
            ref="categoryTree"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="always" style="margin-left: -12px">
          <p>1.学校基本情况</p>
          <p>
            xxxxx地处xxxxx，是xxxxx类院校，举办者为xxxxx，于xxxxx年开办本科。学校现有本科专业xxxxx个，其中招生专业xxxxx个，新专业xxxxx个。
            学校全日制在校生xxxxx人，折合在校生xxxxx人，其中本科生xxxxx。全校教职工xxxxx人，其中专任教师xxxxx人。学校共有xxxxx个校区，其中xxxxx个为本地校区。
            学校有国家实验室xxxxx个，院
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AnalyzeDetail",
  data() {
    return {
      queryParam: {},
      categoryList: [],
      categoryFilter: "",
      categoryProps: {
        children: "children",
        label: "name",
      },
    };
  },
  watch: {
    categoryFilter(val) {
      this.$refs.categoryTree.filter(val);
    },
  },
  methods: {
    searchQuery() {},
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped></style>
