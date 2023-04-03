<template>
  <el-form ref="dataForm" :model="mdl" size="small" label-position="top">
    <el-row :gutter="16">
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="任务名：" required>
          <el-input v-model="mdl.name" placeholder="请输入任务名称" />
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="任务描述：" required>
          <el-input v-model="mdl.desc" placeholder="请输入任务描述" />
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="执行人：" required>
          <el-select
            v-model="mdl.executor"
            placeholder="请选择执行人"
            style="width: 100%;"
          >
            <el-option label="黄丽丽" value="黄丽丽"></el-option>
            <el-option label="李大刀" value="李大刀"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="责任人：" required>
          <el-select
            v-model="mdl.responsor"
            placeholder="请选择责任人"
            style="width: 100%;"
          >
            <el-option label="王晓丽" value="王晓丽"></el-option>
            <el-option label="李军" value="李军"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="提醒时间：" required>
          <el-time-picker
            v-model="mdl.remind"
            placeholder="任意时间点"
            style="width: 100%;"
          >
          </el-time-picker>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="任务类型：" required>
          <el-select
            v-model="mdl.type"
            placeholder="请选择任务类型"
            style="width: 100%;"
          >
            <el-option label="定时执行" value="定时执行"></el-option>
            <el-option label="周期执行" value="周期执行"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      mdl: {}
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
