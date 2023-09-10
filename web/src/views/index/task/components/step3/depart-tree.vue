<template>
  <el-tree
    v-loading="loading"
    ref="tree"
    node-key="id"
    :expand-on-click-node="false"
    :data="departs"
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

  watch: {
    departList: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          let depts = Object.assign([], newVal)
          depts[0].children.forEach(ele => {
            let child = ele.children.filter(dept => dept.status == 1)
            ele.children = child
          })
          this.departs = depts
        }
      }
    }
  },
  data() {
    return {
      departs: []
    }
  },
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
