<template>
  <div>
    <el-form label-width="100px">
      <el-row>
        <h2>学校基本信息</h2>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务类型">
            <el-select
              v-model="basicForm.type"
              clearable
              placeholder="请选择任务类型"
            >
              <!-- TODO -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称">
            <el-input v-model="basicForm.name" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="统计开始时间">
            <el-date-picker
              type="date"
              v-model="basicForm.statisticsStartTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统计截止时间">
            <el-date-picker type="date" v-model="basicForm.statisticsEndTime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学年">
            <el-select
              v-model="basicForm.schoolYear"
              clearable
              placeholder="请选择任务类型"
            >
              <!-- TODO -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自然年">
            <el-input v-model="basicForm.year" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width="150px">
      <el-row>
        <h2>学校专业类别信息</h2>
      </el-row>
      <el-row>
        <h3>
          为配合专业类国家三级认证工作，请确认本校是否包含以下专业类（2022年仅对师范类、医学、工科类专业进行确认）。
        </h3>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="师范类">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="医学专业">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item label="工科类">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="人文社科类专业">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item label="农学类专业">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="理学类专业">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddTaskStepFirst",
  data() {
    return {
      basicForm: {},
      advancedForm: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>