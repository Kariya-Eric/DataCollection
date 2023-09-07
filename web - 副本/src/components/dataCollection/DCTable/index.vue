<template>
  <div>
    <el-table
      :data="data"
      :size="size"
      border
      :header-cell-style="headerStyle"
      style="width: 100%"
      v-bind="$attrs"
      class="list-table"
      v-on="$listeners"
      ref="table"
    >
      <el-table-column v-if="selection" :type="selection" width="60" align="center" />
      <el-table-column
        v-for="(col, i) in columns"
        :key="i"
        :label="col.label"
        :prop="col.prop"
        :align="col.align || 'center'"
        :sortable="col.sort"
        :width="col.width"
      >
        <template slot-scope="{ row }">
          <slot v-if="col.slot" :row="row" :name="col.slot"></slot>
          <template v-else>
            <span v-if="!row[col.prop]">-</span>
            <span v-else-if="typeof row[col.prop] === 'string'">
              <dc-ellipsis v-model="row[col.prop]" :length="col.length" />
            </span>
            <span v-else>{{ row[col.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container" v-if="pagination">
      <el-pagination
        align="right"
        :layout="layout"
        :background="background"
        :page-sizes="pagination.pageSizeOptions"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DCTable',
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    selection: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes,jumper'
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headerStyle: {
        backgroundColor: '#F4F5F6'
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.$emit('change', this.pagination)
    },

    handleCurrentChange(val) {
      this.pagination.current = val
      this.$emit('change', this.pagination)
    },

    clearSelection() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  margin-right: 10px;
  /deep/ .el-pagination__jump {
    margin-left: 0px;
  }
}
</style>
