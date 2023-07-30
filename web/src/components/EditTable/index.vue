<template>
  <div>
    <vxe-table
      border
      resizable
      show-overflow
      :data="dataSource"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column
        v-for="item in column"
        :field="item.name"
        :resizable="true"
        :min-width="item.width ? item.width : 120"
        :title="item.name"
        :key="item.name"
        :edit-render="{ autofocus: '.vxe-input--inner' }"
      >
        <template #edit="{ row }">
          <vxe-input v-model="row.name" type="text"></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";

export default {
  props: ["columns", "dataSource"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
