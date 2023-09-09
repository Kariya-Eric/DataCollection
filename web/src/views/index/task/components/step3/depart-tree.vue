<template>
  <el-tree
    v-loading="loading"
    ref="tree"
    node-key="id"
    :expand-on-click-node="false"
    :data="departList"
    :props="{ label: 'name', children: 'children' }"
    default-expand-all
    :filter-node-method="filterNode"
    highlight-current
    @current-change="select"
  >
    <span slot-scope="{ data }">
      <span> <svg-icon icon-class="部门" />{{ data.name }} </span>
    </span>
  </el-tree>
</template>

<script>
export default {
  name: 'DepartTree',
  props: ['loading', 'departList'],
  methods: {
    filter(value) {
      this.$refs.tree.filter(value)
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    select(data) {
      this.$emit('select', data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
