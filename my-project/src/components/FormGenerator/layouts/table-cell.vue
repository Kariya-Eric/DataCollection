<template>
  <div>
    <template v-if="column.type.__config__.label === '单行文本'">
      <a-input :placeholder="`请输入${placeholder}`" v-model="inputVal" />
    </template>
    <template v-if="column.type.__config__.label === '多行文本'">
      <form-textarea :placeholder="`请输入${placeholder}`" v-model="inputTextVal" />
      <!-- <a-textarea :placeholder="`请输入${placeholder}`" v-model="inputTextVal" /> -->
    </template>
    <template v-if="column.type.__config__.label === '数字'">
      <a-input-number
        :style="column.type.style"
        :placeholder="`请输入${placeholder}`"
        :precision="column.type.precision"
        :min="column.type.min"
        :max="column.type.max"
        v-model="inputNumberVal"
      />
    </template>
    <template v-if="column.type.__config__.label === '邮箱'">
      <form-mail :style="column.type.style" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.label === '链接'">
      <form-link :style="column.type.style" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.label === '电话'">
      <form-phone :style="column.type.style" :isMobile="column.type.isMobile" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.label === '地址'">
      <!-- <form-address :style="column.type.style" :placeholder="`请输入${placeholder}`" /> -->
    </template>
    <template v-if="column.type.__config__.label === '下拉选择'">
      <a-select :style="column.type.style" :placeholder="`请选择${placeholder}`" :multiple="column.type.multiple" :filterable="column.type.filterable" v-model="selectVal">
        <a-select-option v-for="(item, index) in column.type.__slot__.options" :key="index" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </template>
    <template v-if="column.type.__config__.label === '日期选择'">
      <dc-date :placeholder="`请选择${placeholder}`" :mode="column.type.mode" :format="column.type.format" :style="column.type.style" v-model="dateVal"></dc-date>
    </template>
  </div>
</template>

<script>
// 表格组件cell框
export default {
  name: 'TableCell',
  props: ['column', 'placeholder'],
  data() {
    return {
      inputVal: '',
      inputTextVal: '',
      inputNumberVal: undefined,
      dateVal: undefined,
      selectVal: this.column.type.multiple ? [] : ''
    }
  }
}
</script>

<style lang="less" scoped></style>
