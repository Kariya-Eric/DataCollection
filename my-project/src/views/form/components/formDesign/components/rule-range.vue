<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <a-button icon="plus-circle" link @click="add(0)"> 且条件 </a-button>
      <a-button icon="plus-circle" link @click="add(1)"> 或条件 </a-button>
    </div>
    <div v-for="(range, index) in dataRangeVal" :key="index">
      <div v-if="range.and_or != ''" style="margin-left: 24px">
        {{ range.and_or == 'and' ? '并且' : '或者' }}
      </div>
      <div class="innerDiv">
        <div v-if="dataRangeVal.length != 1" class="iconDiv">
          <a-icon type="delete" @click="del(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleRange',
  props: ['value', 'drawingList'],
  data() {
    return {
      dataRangeVal: [],
      operatorList: ['<', '<=', '=', '>=', '>', '!='],
      calculateList: ['+', '-', '*', '/']
    }
  },
  watch: {
    value(newVal) {}
  },
  methods: {
    add(andOr) {},
    del(index) {}
  }
}
</script>

<style lang="less" scoped></style>
