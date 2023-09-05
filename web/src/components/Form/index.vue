<template>
  <el-form
    :model="form"
    ref="form"
    :label-position="labelPoistion"
    :label-width="labelWidth"
  >
    <el-form-item v-for="(item, i) in items" :key="i">
      <!-- input -->
      <el-input
        v-if="item.type === 'input'"
        v-model.trim="form[item.prop]"
        :placeholder="item.placeholder"
        size="small"
        :disabled="item.disabled"
        clearable
      />

      <!-- select -->
      <el-select
        v-if="item.type === 'select'"
        v-model="form[item.prop]"
        :placeholder="item.placeholder"
        :multiple="item.multiple"
        style="width: 100%"
        size="small"
        :disabled="item.disabled"
        filterable
        clearable
      >
        <template v-if="item.group">
          <el-option-group
            v-for="(group,k)in item.options"
            :key="k"
            :label="group.label"
            :value="group.value"
          >
            <el-option
              v-for="(opt, key) in group.options"
              :key="key"
              :label="opt.label || opt.name"
              :value="opt.value || opt.id"
            />
          </el-option-group>
        </template>
        <template v-else>
          <el-option
            v-for="(opt, key) in item.options"
            :key="key"
            :label="opt.label || opt.name"
            :value="opt.value || opt.id"
          />
        </template>
      </el-select>

      <!-- radio -->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="form[item.prop]"
        :disabled="item.disabled"
      >
        <el-radio
          v-for="(opt, key) in item.options"
          :key="key"
          :label="opt.value || opt.id"
          >{{ opt.label || opt.name }}</el-radio
        >
      </el-radio-group>

      <!-- checkbox -->
      <el-checkbox-group
        v-if="item.type === 'checkbox'"
        v-model="form[item.prop]"
        :disabled="item.disabled"
      >
        <el-checkbox
          v-for="(opt, key) in item.options"
          :key="key"
          :label="opt.value || opt.id"
          >{{ opt.label || opt.name }}</el-checkbox
        >
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
        value-format="yyy-MM-dd"
        size="small"
        :placeholder="item.placeholder"
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
        size="small"
        :placeholder="item.placeholder"
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
        size="small"
        :placeholder="item.placeholder"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Form",
  props: {
    form: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    labelPoistion: {
      type: String,
      default: "left",
    },
    labelWidth: {
      type: String,
      default: "80px",
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>