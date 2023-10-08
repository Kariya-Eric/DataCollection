<template>
  <div>
    <template v-if="type === '省（直辖市、自治区）/市/区-详细地址'">
      <a-input-group>
        <area-cascader v-model="address" :data="pcaa" :placeholder="placeholder" :level="level" type="text" @change="changeAreaCascader" />
        <a-textarea style="margin-top: 8px" v-model="extraAddress" :placeholder="placeholder" @change="changeExtra" />
      </a-input-group>
    </template>
    <template v-else>
      <area-cascader v-model="address" :data="pcaa" :placeholder="placeholder" :level="level" type="text" @change="changeAreaCascader" />
    </template>
  </div>
</template>

<script>
import 'vue-area-linkage/dist/index.css'
import { pcaa } from 'area-data'

export default {
  name: 'FormAddress',
  props: ['value', 'placeholder', 'type'],
  data() {
    return {
      pcaa,
      address: [],
      fullAddress: '',
      level: 0,
      extraAddress: ''
    }
  },
  watch: {
    type: {
      handler(newval) {
        this.address = []
        this.fullAddress = ''
        this.extraAddress = ''
        if (newval === '国/省（直辖市、自治区）/市') {
          this.level = 0
        } else if (newval === '省（直辖市、自治区）/市/区') {
          this.level = 1
        } else {
          this.level = 1
        }
        this.$emit('input', this.fullAddress)
      },
      immediate: true
    },
    value: {
      handler(newval) {
        if (newval) {
          if (this.type === '国/省（直辖市、自治区）/市') {
            this.address = newval.split('/')
            this.extraAddress = ''
          } else if (this.type === '省（直辖市、自治区）/市/区') {
            this.address = newval.split('/')
            this.extraAddress = ''
          } else {
            let arr = newval.split('/')
            this.extraAddress = arr[arr.length - 1]
            arr.pop()
            this.address = arr
          }
        } else {
          this.address = []
          this.fullAddress = ''
          this.extraAddress = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    changeAreaCascader(val) {
      console.log(val)
    },
    changeExtra(e) {}
  }
}
</script>

<style lang="less">
.area-select {
  width: 100% !important;
  vertical-align: middle;
}
.area-select .area-selected-trigger {
  position: absolute;
  top: 50%;
  right: 9px;
  left: 0;
  max-width: 100%;
  height: 32px;
  margin-top: -15px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.65);
  line-height: 16px;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
}
.cascader-menu-list .cascader-menu-option.selected {
  color: #2f68bd;
}
</style>
