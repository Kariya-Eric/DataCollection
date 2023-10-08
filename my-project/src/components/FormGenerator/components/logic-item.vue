<template>
  <div class="item">
    <a-select v-model="term" style="width: 20%; margin-right: 8px" @change="changeTerm">
      <a-select-option v-for="(item, index) in options" :key="index" :value="item.value">{{ item.label }}</a-select-option>
    </a-select>
    <a-select style="width: 15%; margin-right: 8px" v-model="calFlag" :disabled="calFlagList.length == 0" @change="changeCalFlag">
      <a-select-option v-for="(item, index) in calFlagList" :key="index" :value="item.value">{{ item.label }}</a-select-option>
    </a-select>
    <a-input-number :disabled="calFlagList.length == 0" v-if="inputType == 1" v-model="termVal" @change="changeTermVal" style="width: 55%" />
    <dc-date :disabled="calFlagList.length == 0" v-else-if="inputType == 2" v-model="termVal" @change="changeTermVal" style="width: 55%" />
    <a-select :disabled="calFlagList.length == 0" v-else-if="inputType == 3" multiple v-model="termVals" @change="changeTermVal" style="width: 55%">
      <a-select-option v-for="(item, index) in termOptions" :key="index" :value="item.value">{{ item.label }}</a-select-option>
    </a-select>
    <a-input v-else v-model="termVal" style="width: 55%" @change="changeInputTermVal" :disabled="calFlagList.length == 0" />
  </div>
</template>

<script>
export default {
  name: 'LogicItem',
  props: ['value', 'drawingList'],
  data() {
    return {
      calFlagList: [],
      term: '',
      calFlag: '',
      inputType: 0,
      termVal: '',
      termVals: [],
      termOptions: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.term = val.term
        this.initOptions(val.term)
        this.$nextTick(() => {
          if (val.termVal instanceof Array) {
            this.termVals = val.termVal
          } else {
            this.termVal = val.termVal
          }
          this.calFlag = val.calFlag
        })
      },
      immediate: true
    },
    term(newVal) {
      this.resetTerm()
      this.initOptions(newVal)
    }
  },
  computed: {
    options() {
      let optionList = []
      this.drawingList.forEach(item => {
        if (item.__config__.tag != 'formDivider' && item.__config__.layout != 'tableLayout') {
          optionList.push({
            label: item.__config__.label,
            value: item.__config__.formId
          })
        }
      })
      return optionList
    }
  },

  methods: {
    initOptions(val) {
      if (val == '') {
        return
      }
      let component = this.drawingList.filter(item => item.__config__.formId == val)[0]
      if (
        component.__config__.tag == 'a-input' ||
        component.__config__.tag == 'formLink' ||
        component.__config__.tag == 'formMail' ||
        component.__config__.tag == 'formAddress' ||
        component.__config__.tag == 'formPhone'
      ) {
        this.calFlagList = [
          { label: '等于', value: '==' },
          { label: '不等于', value: '!=' }
        ]
        this.inputType = 0
      } else if (component.__config__.tag == 'a-input-number' || component.__config__.tag == 'a-date-picker') {
        this.inputType = component.__config__.tag == 'a-input-number' ? 1 : 2
        this.calFlagList = [
          { label: '等于', value: '==' },
          { label: '不等于', value: '!=' },
          { label: '大于', value: '>' },
          { label: '小于', value: '<' },
          { label: '大于等于', value: '>=' },
          { label: '小于等于', value: '<=' }
        ]
      } else {
        this.calFlagList = [
          { label: '等于任意值', value: '||' },
          { label: '不等于任何值', value: '&&' }
        ]
        this.termOptions = component.__slot__.options
        this.inputType = 3
      }
    },
    resetTerm() {
      this.calFlag = ''
      this.calFlagList = []
      this.termVal = ''
      this.termVals = []
    },

    changeCalFlag(val) {
      this.calFlag = val
      this.handlerVal()
    },

    changeTerm(val) {
      this.term = val
      this.handlerVal()
    },

    changeTermVal(val) {
      this.termVal = val
      this.handlerVal()
    },

    changeInputTermVal(e) {
      this.termVal = e.target.value
      this.handlerVal()
    },

    handlerVal() {
      if (this.inputType != 3) {
        this.$emit('input', {
          term: this.term,
          calFlag: this.calFlag,
          termVal: this.termVal
        })
      } else {
        this.$emit('input', {
          term: this.term,
          calFlag: this.calFlag,
          termVal: this.termVals
        })
      }
    }
  }
}
</script>

<style></style>
