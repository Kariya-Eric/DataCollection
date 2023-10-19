<template>
  <a-card title="师生概况" style="height: 360px">
    <a-row :gutter="12" v-for="(info, index) in teacherInfo" :key="index">
      <a-col v-for="(item, index) in info" :key="index" :span="12">
        <a-row :gutter="2">
          <a-col :span="8">
            <a-icon type="appstore" theme="twoTone" style="font-size: 64px" />
          </a-col>
          <a-col :span="16">
            <p>
              <strong style="font-weight: 600; font-size: 20px">{{ item.value }}</strong>
            </p>
            <p>{{ item.title }}</p>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: 'TeacherInfoCard',
  data() {
    return {
      teacherInfo: [
        [
          { title: '全日制在校生(人)', value: 35226 },
          { title: '全校教职工(人)', value: 2693 }
        ],
        [
          { title: '本科生(人)', value: 27493 },
          { title: '专任教师(人)', value: 1779 }
        ],
        [
          { title: '本科生占全日制在校生比例', value: '60.3%' },
          { title: '专任教师占全校教职工比例', value: '60.3%' }
        ]
      ]
    }
  }
}
</script>

<style></style>
