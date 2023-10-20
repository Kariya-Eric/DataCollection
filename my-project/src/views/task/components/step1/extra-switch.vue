<template>
  <div style="margin-top: 24px; text-align: center">
    <a-row>
      <a-col :span="7" :offset="3">
        <a-form-item :label="labels[0]" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
          <a-switch :checked="values[0]" @change="changeFirst" />
        </a-form-item>
      </a-col>
      <a-col :span="7">
        <a-form-item :label="labels[1]" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
          <a-switch :checked="values[1]" @change="changeSecond" />
        </a-form-item>
      </a-col>
      <a-col :span="7">
        <a-form-item :label="labels[2]" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
          <a-switch :checked="values[2]" @change="changeThird" />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'ExtraSwitch',
  props: ['value'],
  data() {
    return {
      labels: ['师范类', '医学专业', '工科类'],
      values: [false, false, false]
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          let array = newVal.split(',')
          array.forEach(item => {
            let index = this.labels.indexOf(item)
            this.values[index] = index != -1
          })
        }
      },
      immediate: true
    }
  },

  methods: {
    changeFirst(val) {
      this.values[0] = val
      let labels = []
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i]) {
          labels.push(this.labels[i])
        }
      }
      this.$emit('input', labels.join(','))
    },
    changeSecond(val) {
      this.values[1] = val
      let labels = []
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i]) {
          labels.push(this.labels[i])
        }
      }
      this.$emit('input', labels.join(','))
    },
    changeThird(val) {
      this.values[2] = val
      let labels = []
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i]) {
          labels.push(this.labels[i])
        }
      }
      this.$emit('input', labels.join(','))
    }
  }
}
</script>

<style></style>
