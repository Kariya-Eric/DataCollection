<template>
  <page-header-layout title="基础表单">
    <div slot="headerContent" style="padding-bottom: 10px;">
      <div>
        <span>
          表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。
        </span>
      </div>
    </div>

    <el-card shadow="always" class="app-card">
      <el-col
        :md="{ offset: 0, span: 24 }"
        :lg="{ offset: 6, span: 12 }"
        style="padding: 50px 0px;"
      >
        <el-form
          ref="dataForm"
          :model="mdl"
          :rules="rules"
          label-width="100px"
          style="max-width: 1000px;"
          :label-position="(device !== 'desktop' && 'top') || 'right'"
          size="small"
        >
          <el-form-item label="标题：" prop="title">
            <el-input v-model="mdl.title" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="活动时间：" required>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="mdl.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col :span="2" style="text-align: center;">-</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="mdl.date2"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="目标描述：" prop="desc">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入你的阶段工作目标"
              v-model="mdl.desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="衡量标准：" required>
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入衡量标准"
              v-model="mdl.metric"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户：" required>
            <el-input
              v-model="mdl.client"
              placeholder="请描述你服务的客户, 内部客户直接 @姓名/工号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邀评人：" required>
            <el-input
              v-model="mdl.assessor"
              placeholder="请直接 @姓名/工号, 最多可邀请 5 人"
            ></el-input>
          </el-form-item>
          <el-form-item label="权重：" required>
            <el-input-number
              v-model="mdl.num"
              controls-position="right"
              :min="1"
              :max="100"
            ></el-input-number
            >%
          </el-form-item>
          <el-form-item label="目标公开：">
            <el-radio-group v-model="mdl.pub">
              <el-radio label="0">公开</el-radio>
              <el-radio label="1">部分公开</el-radio>
              <el-radio label="2">不公开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="mdl.pub === '1'">
            <el-input v-model="mdl.partial"></el-input>
          </el-form-item>
          <el-form-item>
            <span>客户、邀评人默认被分享</span>
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" size="small">提交</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </el-col>
    </el-card>
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { mapState } from 'vuex';

export default {
  components: {
    PageHeaderLayout
  },
  data() {
    return {
      mdl: {
        pub: '0'
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '目标描述不能为空', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState('app', ['device'])
  }
};
</script>

<style lang="scss" scoped>
</style>
