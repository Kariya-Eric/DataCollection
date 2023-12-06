<template>
  <el-select v-model="valueId" :clearable="clearable" @clear="clearHandle" size="small" v-bind="$attrs" :style="{ width }" @focus="setOptionWidth">
    <div class="optionClass">
      <el-input class="selectInput" v-model="filterText" size="small"> </el-input>
      <el-option :value="valueId" :label="valueTitle" class="options" :style="{ width: optionWidth }">
        <el-tree
          size="small"
          id="tree-option"
          ref="selectTree"
          :data="options"
          :props="props"
          :node-key="props.value"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-option>
    </div>
  </el-select>
</template>

<script>
export default {
  name: 'DcTreeSelect',
  props: {
    width: {
      type: String,
      default: '100%',
      required: false
    },
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'name', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: [Number, String],
      default: undefined
    },
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  data() {
    return {
      optionWidth: '',
      filterText: '',
      valueId: '',
      valueTitle: undefined
    }
  },
  methods: {
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => (ele.style.width = 0))
      })
    },
    // 切换选项
    handleNodeClick(node) {
      if (!node.disabled) {
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('change', this.valueId)
      }
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = undefined
      this.valueId = undefined
      this.clearSelected()
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach(element => element.classList.remove('is-current'))
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    setOptionWidth(event) {
      this.$nextTick(() => (this.optionWidth = event.srcElement.offsetWidth + 'px'))
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.valueId = newVal
        if (newVal) {
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label] // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueTitle) // 设置默认选中
        }
        this.initScroll()
      },
      immediate: true
    },
    filterText(val) {
      this.$refs.selectTree.filter(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  max-height: 320px;
  height: auto;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #2f68bd;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
