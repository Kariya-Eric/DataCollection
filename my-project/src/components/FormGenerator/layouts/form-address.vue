<template>
  <div>
    <template v-if="typeNum === 2">
      <a-cascader
        v-model="address2"
        :options="pcaTextArr"
        :placeholder="placeholder"
        @change="changeAreaCascader2"
        :showSearch="{ filter }"
        :disabled="disabled"
        :getPopupContainer="target => target.parentNode"
      />
      <a-textarea v-model="extraAddress" :placeholder="placeholder" @change="changeExtra" :disabled="disabled" />
    </template>
    <template v-if="typeNum === 1">
      <a-cascader
        v-model="address1"
        :options="pcaTextArr"
        :placeholder="placeholder"
        @change="changeAreaCascader1"
        :showSearch="{ filter }"
        :disabled="disabled"
        :getPopupContainer="target => target.parentNode"
      />
    </template>
    <template v-if="typeNum === 0">
      <a-cascader
        v-model="address0"
        :options="cpcTextArr"
        :placeholder="placeholder"
        @change="changeAreaCascader0"
        :showSearch="{ filter }"
        :disabled="disabled"
        :getPopupContainer="target => target.parentNode"
      />
    </template>
  </div>
</template>

<script>
import { pcTextArr, pcaTextArr } from 'element-china-area-data'
export default {
  name: 'FormAddress',
  props: ['value', 'placeholder', 'type', 'disabled'],
  data() {
    return {
      pcTextArr,
      pcaTextArr,
      address0: [],
      address1: [],
      address2: [],
      extraAddress: '',
      cpcTextArr: []
    }
  },
  computed: {
    typeNum() {
      if (this.type === '国/省（直辖市、自治区）/市') {
        let pcArr = JSON.parse(JSON.stringify(this.pcTextArr))
        pcArr.forEach(pc => {
          if (pc.value == '北京市' || pc.value == '天津市' || pc.value == '上海市' || pc.value == '重庆市') {
            delete pc.children
          }
        })
        this.cpcTextArr = [{ label: '中国', value: '中国', children: pcArr }]
        return 0
      } else if (this.type === '省（直辖市、自治区）/市/区') {
        return 1
      } else {
        return 2
      }
    }
  },
  watch: {
    type: {
      handler() {
        this.address0 = []
        this.address1 = []
        this.address2 = []
        this.extraAddress = ''
      },
      immediate: true
    },
    value: {
      handler(newval) {
        if (newval) {
          if (this.typeNum == 0) {
            this.address0 = newval.split('/')
          } else if (this.typeNum == 1) {
            this.address1 = newval.split('/')
          } else {
            let arr = newval.split('/')
            if (arr.length === 4) {
              this.extraAddress = arr[arr.length - 1]
              arr.pop()
              this.address2 = arr
            } else if (arr.length == 3) {
              this.extraAddress = ''
              this.address2 = arr
            } else {
              this.address2 = []
              this.extraAddress = newval
            }
          }
        } else {
          this.address0 = []
          this.address1 = []
          this.address2 = []
          this.extraAddress = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },

    changeAreaCascader2() {
      let fullAddress
      if (this.extraAddress) {
        fullAddress = this.address2.join('/') + '/' + this.extraAddress
      } else {
        fullAddress = this.address2.join('/')
      }
      this.$emit('input', fullAddress)
    },

    changeAreaCascader1() {
      this.$emit('input', this.address1.join('/'))
    },

    changeAreaCascader0() {
      this.$emit('input', this.address0.join('/'))
    },

    changeExtra() {
      let fullAddress
      if (this.extraAddress) {
        fullAddress = this.address2.length == 0 ? this.extraAddress : this.address2.join('/') + '/' + this.extraAddress
      } else {
        fullAddress = this.address2.join('/')
      }
      this.$emit('input', fullAddress)
    }
  }
}
</script>

<style></style>
