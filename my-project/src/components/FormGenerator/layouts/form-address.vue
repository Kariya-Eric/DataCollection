<template>
  <div style="margin-top: 4px">
    <template v-if="typeNum === 2">
      <a-input-group>
        <div :class="[address2.length != 0 ? 'normal' : 'placeholder']">
          <area-cascader v-model="address2" :data="pcaa" :placeholder="placeholder" :level="1" type="text" @change="changeAreaCascader2" v-if="mounted" />
          <a-textarea style="margin-top: 6px" v-model="extraAddress" :placeholder="placeholder" @change="changeExtra" />
        </div>
      </a-input-group>
    </template>
    <template v-if="typeNum === 1">
      <div :class="[address1.length != 0 ? 'normal' : 'placeholder']">
        <area-cascader v-model="address1" :data="pcaa" :placeholder="placeholder" :level="1" type="text" @change="changeAreaCascader1" v-if="mounted" />
      </div>
    </template>
    <template v-if="typeNum === 0">
      <div :class="[address0.length != 0 ? 'normal' : 'placeholder']">
        <area-cascader v-model="address0" :data="pcaa" :placeholder="placeholder" :level="0" type="text" @change="changeAreaCascader0" v-if="mounted" />
      </div>
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
      address0: [],
      address1: [],
      address2: [],
      extraAddress: '',
      refresh: true,
      mounted: false
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
    }
  },
  watch: {
    type: {
      handler() {
        this.mounted = false
        this.address0 = []
        this.address1 = []
        this.address2 = []
        this.extraAddress = ''
        this.$nextTick(() => (this.mounted = true))
      },
      immediate: true
    },
    value: {
      handler(newval) {
        this.mounted = false
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
        this.$nextTick(() => (this.mounted = true))
      },
      immediate: true
    }
  },
  methods: {
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

<style lang="less">
.has-error .area-select,
.has-error .area-select:hover {
  border-color: red;
}
.area-select {
  width: 100% !important;
  vertical-align: middle !important;
}
.normal {
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
}

.placeholder {
  .area-select .area-selected-trigger {
    position: absolute;
    top: 50%;
    right: 9px;
    left: 0;
    max-width: 100%;
    height: 32px;
    margin-top: -15px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.35);
    line-height: 16px;
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
  }
}

.cascader-menu-list .cascader-menu-option.selected {
  color: #2f68bd;
}
</style>
