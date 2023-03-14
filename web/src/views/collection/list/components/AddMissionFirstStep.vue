<template>
  <div class="modalDiv">
    <a-typography>
      <a-typography-title :heading="4">基础信息</a-typography-title>
      <a-form ref="basicForm" :model="basicForm">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="任务类型">
              <a-select
                placeholder="请选择任务类型"
                v-model="basicForm.missionType"
              >
                <a-option>全部</a-option>
                <a-option>教学基本状态数据</a-option>
                <a-option>其他数据</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="任务名称">
              <a-input
                placeholder="输入任务名称"
                v-model="basicForm.missionName"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="统计开始时间">
              <a-date-picker
                style="width: 200px"
                v-model="basicForm.startTime"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="统计截止时间">
              <a-date-picker style="width: 200px" v-model="basicForm.endTime" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="学年">
              <a-select placeholder="请选择" v-model="basicForm.studyYear">
                <a-option>2019</a-option>
                <a-option>2020</a-option>
                <a-option>2021</a-option>
                <a-option>2022</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="自然年" v-model="basicForm.naturalYear">
              <a-input disabled />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-typography>
    <a-typography v-if="basicForm.missionType == '教学基本状态数据'">
      <a-typography-title :heading="4"
        >学校专业类别信息
        <a-span>(必选,系统将根据专业类情况初始化相应的专业类数据采集表)</a-span>
      </a-typography-title>
      <a-typography-paragraph>
        为配合专业类国家三级认证工作,请确认本校是否包含以下专业类（2022年仅对师范类、医学、工科类专业进行确认）。
      </a-typography-paragraph>
      <a-form ref="detailForm" :model="detailForm">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="师范类" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="医疗专业" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="工科类" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="人文社科类专业" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="农学类专业" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="理学类专业" label-col-flex="100px">
              <a-switch />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-typography>
  </div>
</template>

<script>
  export default {
    name: 'AddMissionFirstStep',
    data() {
      return {
        basicForm: {},
        detailForm: {},
      };
    },
  };
</script>

<style scoped lang="less"></style>
