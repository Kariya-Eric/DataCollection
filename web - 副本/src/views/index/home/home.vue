<template>
  <div>
    <el-row
      :gutter="20"
      v-for="(row, index) in rows"
      :key="index"
      style="margin-bottom: 20px"
    >
      <el-col :span="6" v-for="(data, index) in row" :key="index">
        <task-card :task="data" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TaskCard from "./components/task-card";
export default {
  components: { TaskCard },
  data() {
    return {
      dataList: [
        {
          showLabel: 1,
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          showLabel: 2,
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
        {
          name: "2022年状态数据填报",
          startTime: "2022-09-01",
          endTime: "2022-12-01",
        },
      ],
    };
  },
  computed: {
    rows() {
      let row = [];
      for (let i = 0; i < this.dataList.length; i = i + 4) {
        row.push(this.dataList.slice(i, i + 4));
      }
      return row;
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss"></style>
