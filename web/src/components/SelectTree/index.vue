<template>
  <el-select
    ref="selectTree"
    :value="value"
    v-model="valueName"
    :multiple="multiple"
    :clearable="clearable"
    @clear="clearHandle"
    @change="changeValue"
  >
    <el-option :value="valueName" class="options">
      <el-tree
        id="tree-option"
        ref="selectedTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ data }">
          <i
            class="[data.color!=null?'ification_col':'']"
            :style="{ 'background-color': data.color }"
          ></i
          >&nbsp;&nbsp;{{ data.name }}
        </span>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "SelectTree",
  props: {
    props: {
      type: Object,
      default: () => {
        return { value: "id", children: "children", label: "name" };
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: String,
      default: "",
    },
    valueMultiple: {
      type: Array,
      default: () => {
        return [];
      },
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      resultValue: [],
      valueName: this.multiple ? [] : "",
    };
  },
  watch: {
    value() {
      this.resultValue = this.multiple ? this.valueMultiple : this.value;
      this.initHandle();
    },
  },

  mounted() {
    this.resultValue = this.multiple ? this.valueMultiple : this.value;
    this.initHandle();
  },
  methods: {
    initHandle() {
      if (this.resultValue) {
        if (this.multiple) {
          this.resultValue.forEach((item) => this.valueName.push(item.name));
        } else {
          this.valueName = this.renderList(this.options).filter(
            (o) => o.value == this.resultValue
          )[0].label;
        }
      }
    },

    handleNodeClick(node) {
      if (this.multiple) {
        let num = 0;
        this.valueName.forEach((item) =>
          item == node[this.props.label] ? num++ : num
        );
        if (num == 0) {
          this.valueName.push(node[this.props.label]);
          this.resultValue.push(node);
        }
      } else {
        this.$refs.selectTree.blur();
        this.valueName = node[this.props.label];
        this.resultValue = node.id;
      }
      this.$emit("getValue", this.resultValue);
    },

    changeValue(val) {
      if (this.multiple) {
        this.resultValue.forEach((item, index) => {
          let i = val.indexOf(item.name);
          if (i == -1) {
            this.resultValue.splice(index, 1);
          }
        });
        this.$emit("getValue", this.resultValue);
      } else {
        this.$emit("getValue", val);
      }
    },

    clearHandle() {
      this.valueName = this.multiple ? [] : "";
      this.resultValue = this.multiple ? [] : "";
      this.clearSelected();
      this.$emit("getValue", this.resultValue);
    },

    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach((ele) => ele.classList.remove("is-current"));
    },

    renderList(list) {
      let options = [];
      this.recusive(list, options);
      return options;
    },

    recusive(list, options) {
      list.forEach((item) => {
        options.push({ label: item.name, value: item.id });
        if (item.children && item.children.length > 0) {
          this.recusive(item.children, options);
        }
      });
    },
  },
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 300px;
  padding: 0;
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
  font-weight: 700;
  color: #409eff;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  font-weight: normal;
  color: #606266;
}
.el-popper {
  z-index: 999;
}
.ifcation_col {
  width: 20px;
  height: 10px;
  display: inline-block;
}
</style>
