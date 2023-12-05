<template>
  <div>
    <template v-if="column.type.__config__.tag === 'a-input'">
      <a-input :placeholder="`请输入${placeholder}`" v-model="inputVal" />
    </template>
    <template v-if="column.type.__config__.tag === 'a-textarea'">
      <form-textarea :placeholder="`请输入${placeholder}`" v-model="inputTextVal" />
      <!-- <a-textarea :placeholder="`请输入${placeholder}`" v-model="inputTextVal" /> -->
    </template>
    <template v-if="column.type.__config__.tag === 'a-input-number'">
      <a-input-number
        :style="column.type.style"
        :placeholder="`请输入${placeholder}`"
        :precision="column.type.precision"
        :min="column.type.min"
        :max="column.type.max"
        v-model="inputNumberVal"
      />
    </template>
    <template v-if="column.type.__config__.tag === 'formMail'">
      <form-mail :style="column.type.style" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.tag === 'formLink'">
      <form-link :style="column.type.style" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.tag === 'formPhone'">
      <form-phone :style="column.type.style" :isMobile="column.type.isMobile" :placeholder="`请输入${placeholder}`" />
    </template>
    <template v-if="column.type.__config__.tag === 'formAddress'">
      <form-address-pop :style="column.type.style" :placeholder="`请输入${placeholder}`" :type="column.type.type" />
    </template>
    <template v-if="column.type.__config__.tag === 'a-select'">
      <a-select
        :style="column.type.style"
        :placeholder="`请选择${placeholder}`"
        :mode="column.type.mode"
        :showSearch="column.type.showSearch"
        :getPopupContainer="target => target.parentNode"
        v-model="selectVal"
        :filterOption="(inputValue, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0"
      >
        <a-select-option v-for="(item, index) in column.type.__slot__.options" :key="index" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </template>
    <template v-if="column.type.__config__.tag === 'dc-date'">
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
      selectVal: this.column.type.mode === 'multiple' ? [] : undefined
    }
  }
}
</script>

<style lang="less" scoped></style>
