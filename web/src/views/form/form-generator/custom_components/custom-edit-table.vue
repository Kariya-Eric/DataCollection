<template>
  <div>
    <el-button>增加</el-button>
    <el-button>删除</el-button>
    <el-table
      :data="tableData"
      border
      size="small"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column
        v-for="(title, index) in columns"
        :label="title.label"
        :index="title.index"
        :key="index"
      ></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [{ label: "列1" }, { label: "列2" }, { label: "列3" }],
      tableData: [],
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less"></style>
