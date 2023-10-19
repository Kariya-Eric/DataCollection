<template>
  <a-card title="课程概况">
    <a-row :gutter="12" v-for="(info, index) in courseInfo" :key="index">
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
  name: 'CourseDescriptionCard',
  data() {
    return {
      courseInfo: [[{ title: '本科生生均课程(门)', value: '0.1' }]]
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/.ant-card-body {
//   height: 260px;
// }
</style>
