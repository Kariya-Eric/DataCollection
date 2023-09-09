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
    <span class="custom-tree-node" slot-scope="{ data }">
      <span> <svg-icon icon-class="部门" />{{ data.name }} </span>
      <template v-if="data.grade == 'ORG'">
        <span class="icons">
          <svg-icon icon-class="编辑" @click.stop="edit(data)" />
          <el-popconfirm title="确认删除吗？" @confirm="del(data)">
            <svg-icon icon-class="删除" slot="reference" @click.native.stop />
          </el-popconfirm>
        </span>
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
      this.$emit('select', data.grade === 'ORG' ? { id: data.id, status: data.status } : {})
    },

    edit(data) {
      this.$emit('edit', { id: data.id, status: data.status })
    },

    del(data) {
      this.$emit('del', { id: data.id, status: data.status })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icons {
    visibility: hidden;
  }
}
.el-tree-node__content:hover .icons {
  visibility: visible;
}
</style>
