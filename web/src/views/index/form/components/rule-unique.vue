<template>
  <div>
    <el-button
      icon="el-icon-circle-plus-outline"
      type="text"
      @click="addUnique"
    >
      添加唯一性组合
    </el-button>
    <div v-for="(item, index) in uniqueValue" :key="index">
      <el-select
        v-model="uniqueValue[index]"
        placeholder="请选择表单字段"
        @change="(val) => change(val, index)"
      >
        <el-option
          v-for="item in drawingList"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <div class="close-btn select-line-icon" v-if="uniqueValue.length > 1">
        <i class="el-icon-remove-outline" @click="delUnique(index)" />
      </div>
    </div>
  </div>
</template>

<script>
// 唯一性校验
export default {
  props: ["value", "drawingList"],
  data() {
    return {
      uniqueValue: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.uniqueValue = newVal;
    },
  },

  methods: {
    addUnique() {
      this.uniqueValue.push("");
      this.$emit("input", this.uniqueValue);
    },

    change(val, index) {
      this.uniqueValue[index] = val;
      this.$emit("input", this.uniqueValue);
    },

    delUnique(index) {
      this.uniqueValue.splice(index, 1);
      this.$emit("input", this.uniqueValue);
    },
  },
};
</script>

<style scoped lang="scss"></style>
