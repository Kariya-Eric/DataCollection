<template>
  <div>
    <template v-if="typeNum === 2">
      <a-popover trigger="contextmenu" v-model="visible" placement="right" overlayClassName="input-pop">
        <div slot="title">
          <span style="float: right" title="关闭">
            <a-icon type="close" @click="visible = false" />
          </span>
        </div>
        <a-input :value="inputContent" readOnly :placeholder="placeholder" @focus="pop">
          <a-icon slot="suffix" type="fullscreen" @click.stop="pop" />
        </a-input>
        <div slot="content">
          <a-cascader v-model="address2" style="width: 100%" :options="pcaTextArr" :placeholder="placeholder" @change="changeAreaCascader2" :showSearch="{ filter }" />
          <a-textarea style="margin-top: 4px" v-model="extraAddress" :placeholder="placeholder" @change="changeExtra" :style="{ height: '150px' }" />
        </div>
      </a-popover>
    </template>
    <template v-if="typeNum === 1">
      <a-cascader v-model="address1" :options="pcaTextArr" :placeholder="placeholder" @change="changeAreaCascader1" :showSearch="{ filter }" />
    </template>
    <template v-if="typeNum === 0">
      <a-cascader v-model="address0" :options="pcTextArr" :placeholder="placeholder" @change="changeAreaCascader0" :showSearch="{ filter }" />
    </template>
  </div>
</template>

<script>
import { pcTextArr, pcaTextArr } from 'element-china-area-data'
export default {
  name: 'FormAddressPop',
  props: ['value', 'placeholder', 'type'],
  data() {
    return {
      pcTextArr,
      pcaTextArr,
      address0: [],
      address1: [],
      address2: [],
      extraAddress: '',
      visible: false
    }
  },
  computed: {
    typeNum() {
      if (this.type === '国/省（直辖市、自治区）/市') {
        return 0
      } else if (this.type === '省（直辖市、自治区）/市/区') {
        return 1
      } else {
        return 2
      }
    },
    inputContent() {
      let fullAddress
      if (this.extraAddress) {
        fullAddress = this.address2.length == 0 ? this.extraAddress : this.address2.join('/') + '/' + this.extraAddress
      } else {
        fullAddress = this.address2.join('/')
      }
      return fullAddress
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
    pop() {
      this.visible = true
    },
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
