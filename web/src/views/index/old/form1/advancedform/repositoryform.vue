<template>
  <el-form ref="dataForm" :model="mdl" size="small" label-position="top">
    <el-row :gutter="16">
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="仓库名：" required>
          <el-input v-model="mdl.name" placeholder="请输入仓库名称" />
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="仓库域名：" required>
          <el-input v-model="mdl.domain" placeholder="请输入">
            <template slot="prepend"
              >Http://</template
            >
            <template slot="append"
              >.com</template
            >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="仓库管理员：" required>
          <el-select
            v-model="mdl.manager"
            placeholder="请选择管理员"
            style="width: 100%;"
          >
            <el-option label="王同学" value="王同学"></el-option>
            <el-option label="李同学" value="李同学"></el-option>
            <el-option label="黄同学" value="黄同学"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="审批人：" required>
          <el-select
            v-model="mdl.assessor"
            placeholder="请选择审批人"
            style="width: 100%;"
          >
            <el-option label="王晓丽" value="王晓丽"></el-option>
            <el-option label="李军" value="李军"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="生效日期：" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="mdl.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="mdl.date2"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24">
        <el-form-item label="仓库类型：" required>
          <el-select
            v-model="mdl.type"
            placeholder="请选择仓库类型"
            style="width: 100%;"
          >
            <el-option label="私密" value="私密"></el-option>
            <el-option label="公开" value="公开"></el-option>
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
