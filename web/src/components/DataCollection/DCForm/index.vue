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
        v-if="item.type === 'select' && !item.check"
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
            <el-option v-for="(opt, key) in group.options" :key="key" :label="opt.name || opt.label" :value="opt.id || opt.value" :disabled="opt.disabled" />
          </el-option-group>
        </template>
        <template v-else>
          <el-option v-for="(opt, key) in item.options" :key="key" :label="opt.name || opt.label" :value="opt.id || opt.value" :disabled="opt.disabled" />
        </template>
      </el-select>

      <template v-if="item.type === 'select' && item.check">
        <select-group
          v-if="item.group"
          v-model="form[item.prop]"
          :options="item.options"
          :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
          :multiple="item.multiple"
          style="width: 100%"
          :disabled="item.disabled"
          filterable
          clearable
        />
        <select-all
          v-else
          v-model="form[item.prop]"
          :options="item.options"
          :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
          :multiple="item.multiple"
          style="width: 100%"
          :disabled="item.disabled"
          filterable
          clearable
        />
      </template>

      <!-- radio -->
      <el-radio-group v-if="item.type === 'radio'" v-model="form[item.prop]" :disabled="item.disabled">
        <el-radio v-for="(opt, key) in item.options" :disabled="opt.disabled" :key="key" :label="opt.id || opt.value">{{ opt.name || opt.label }}</el-radio>
      </el-radio-group>

      <!-- checkbox -->
      <el-checkbox-group v-if="item.type === 'checkbox'" v-model="form[item.prop]" :disabled="item.disabled">
        <el-checkbox v-for="(opt, key) in item.options" :disabled="opt.disabled" :key="key" :label="opt.id || opt.value">{{
          opt.name || opt.label
        }}</el-checkbox>
      </el-checkbox-group>

      <!-- switch -->
      <el-switch
        v-if="item.type === 'switch'"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        :active-value="item.number ? 1 : true"
        :inactive-value="item.number ? 0 : false"
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
        value-format="yyyy-MM-dd"
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
        value-format="yyyy-MM"
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
        value-format="yyyy"
        :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
      ></el-date-picker>

      <!-- textarea -->
      <el-input
        v-if="item.type === 'textarea'"
        type="textarea"
        v-model="form[item.prop]"
        :disabled="item.disabled"
        clearable
        :rows="item.rows ? item.rows : 2"
        :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
      />

      <!-- inputnumber -->
      <el-input-number v-if="item.type === 'number'" v-model="form[item.prop]" :disabled="item.disabled" clearable :min="0" :precision="0"></el-input-number>
    </el-form-item>
    <el-form-item v-if="submitButtons">
      <el-button type="primary" @click="submit">{{ okBtn }}</el-button>
      <el-button @click="cancel">{{ cancelBtn }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SelectGroup from './components/select-group'
import SelectAll from './components/select-all'
export default {
  name: 'DCForm',
  components: { SelectGroup, SelectAll },
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
  watch: {
    form(n, o) {
      this.items.forEach(item => {
        let value = n[item.prop]
        if (item.type == 'month' || item.type == 'year' || item.type == 'date') {
          if (value) n[item.prop] = new Date(value)
        }
      })
    }
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
    },

    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped></style>
