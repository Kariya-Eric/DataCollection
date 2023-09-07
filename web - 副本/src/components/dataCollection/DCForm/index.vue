<template>
  <el-form :model="form" ref="form" v-loading="loading" :label-position="labelPoistion" :label-width="labelWidth" v-bind="$attrs" v-on="$listeners">
    <el-form-item v-for="(item, i) in items" :key="i" :label="item.label" :prop="item.prop" :rules="rules(item)">
      <!-- input -->
      <el-input
        v-if="item.type === 'input'"
        v-model.trim="form[item.prop]"
        :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
        :disabled="item.disabled"
        :prefix-icon="item.prefix"
        :suffix-icon="item.suffix"
        clearable
      />

      <!-- select -->
      <el-select
        v-if="item.type === 'select'"
        v-model="form[item.prop]"
        :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
        :multiple="item.multiple"
        style="width: 100%"
        :disabled="item.disabled"
        filterable
        clearable
      >
        <template v-if="item.group">
          <el-option-group v-for="(group, k) in item.options" :key="k" :label="group.label" :value="group.value">
            <el-option v-for="(opt, key) in group.options" :key="key" :label="opt.label || opt.name" :value="opt.value || opt.id" />
          </el-option-group>
        </template>
        <template v-else>
          <el-option v-for="(opt, key) in item.options" :key="key" :label="opt.label || opt.name" :value="opt.value || opt.id" />
        </template>
      </el-select>

      <!-- radio -->
      <el-radio-group v-if="item.type === 'radio'" v-model="form[item.prop]" :disabled="item.disabled">
        <el-radio v-for="(opt, key) in item.options" :key="key" :label="opt.value || opt.id">{{ opt.label || opt.name }}</el-radio>
      </el-radio-group>

      <!-- checkbox -->
      <el-checkbox-group v-if="item.type === 'checkbox'" v-model="form[item.prop]" :disabled="item.disabled">
        <el-checkbox v-for="(opt, key) in item.options" :key="key" :label="opt.value || opt.id">{{ opt.label || opt.name }}</el-checkbox>
      </el-checkbox-group>

      <!-- switch -->
      <el-switch
        v-if="item.type === 'switch'"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        :active-value="item.number ? '1' : true"
        :inactive-value="item.number ? '0' : false"
      ></el-switch>

      <!-- date -->
      <el-date-picker
        v-if="item.type === 'date'"
        style="width: 100%"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        type="date"
        format="yyyy-MM-dd"
        value-format="yyy-MM-dd"
        :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
      ></el-date-picker>

      <el-date-picker
        v-if="item.type === 'month'"
        style="width: 100%"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        type="month"
        format="yyyy-MM"
        value-format="yyy-MM"
        :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
      ></el-date-picker>

      <el-date-picker
        v-if="item.type === 'year'"
        style="width: 100%"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        type="year"
        format="yyyy"
        value-format="yyy"
        :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
      ></el-date-picker>

      <!-- textarea -->
      <el-input
        v-if="item.type === 'textarea'"
        type="textarea"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        :rows="2"
        :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
      />

      <!-- inputnumber -->
      <el-input-number
        v-if="item.type === 'number'"
        style="width: 50%"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
        :min="0"
        :precision="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item v-if="submitButtons">
      <el-button type="primary" @click="submit">{{ okBtn }}</el-button>
      <el-button @click="cancel">{{ cancelBtn }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DCForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    submitButtons: {
      type: Boolean,
      required: false,
      default: false
    },
    okBtn: {
      type: String,
      default: '提交'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    },
    form: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    labelPoistion: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  mounted() {
    this.items.forEach(item => {
      let value = this.form[item.prop]
      if (!value) {
        if (item.type === 'select' && item.multiple) {
          this.$set(this.form, item.prop, [])
        } else if (item.type === 'checkbox') {
          this.$set(this.form, item.prop, [])
        } else if (item.type === 'switch') {
          this.$set(this.form, item.prop, item.number ? '0' : false)
        } else {
          this.$set(this.form, item.prop, '')
        }
      }
    })
    this.$nextTick(() => this.$refs.form.clearValidate())
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', true)
        } else {
          this.$emit('submit', false)
        }
      })
    },

    cancel() {
      this.$emit('cancel')
    },

    rules(item) {
      let rules = []
      if (item.rules) {
        rules = [...item.rules]
      }
      if (item.required) {
        rules.push({ required: true, message: `请输入${item.label}` })
      }
      return rules
    },

    reset() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style></style>
