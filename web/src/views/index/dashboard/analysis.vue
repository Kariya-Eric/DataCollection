<template>
  <el-card shadow="always" class="app-card">
    <mtable
      :data="datasource"
      :columns="columns"
      :pagination="ipagination"
      selection="selection"
      @selection-change="changeSelection"
      @sort-change="changeSort"
    >
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="click(row)">click</el-button>
      </template>
    </mtable>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
      datasource: [{ id: 1, account: "帐号帐号帐号帐号帐号帐号帐号" }],
      columns: [
        { prop: "id", label: "ID" },
        { prop: "account", label: "帐号", sort: true },
        { slot: "action", label: "操作" },
      ],
    };
  },
  methods: {
    click(row) {
      console.log(row);
    },

    changeSelection(row) {
      console.log(row);
    },

    changeSort({ column, prop, order }) {
      console.log("1", column, prop, order);
    },
  },
};
</script>

<style>
</style>