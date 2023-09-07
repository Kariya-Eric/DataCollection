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
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <svg-icon icon-class="部门" />{{ data.name }}
      <template v-if="data.grade == 'ORG'">
        <svg-icon icon-class="编辑" />
        <el-popconfirm title="确认删除吗？">
          <svg-icon icon-class="删除" slot="reference" />
        </el-popconfirm>
      </template>
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
      if (data.grade != 'ORG') {
        return
      }
      this.$emit('select', data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
}
</style>
