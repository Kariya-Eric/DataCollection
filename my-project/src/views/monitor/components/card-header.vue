<template>
  <a-row :gutter="24" style="margin-bottom: 24px">
    <a-col :span="8">
      <a-card style="height: 160px">
        <a-row :gutter="2">
          <a-col :span="6">
            <a-icon type="appstore" theme="twoTone" style="font-size: 108px" />
          </a-col>
          <a-col :span="16">
            <p><strong style="font-weight: 600; font-size: 20px">学校名称</strong></p>
            <p><a-tag color="blue">师范学院</a-tag></p>
            <p>校训文字校训文字校训文字</p>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="2" v-for="(item, i) in titles" :key="i">
      <a-card style="height: 160px">
        <a-result :title="item">
          <template #icon>
            <a-icon type="profile" theme="twoTone" />
          </template>
        </a-result>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'CardHeader',
  data() {
    return {
      titles: ['办学条件', '思政教育', '师资队伍', '学生发展', '培养过程', '质量保证']
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-result {
  padding: 8px 0;
}
/deep/.ant-result-title {
  font-size: 16px;
  font-weight: 600;
}
/deep/.ant-result-icon > .anticon {
  font-size: 56px;
}
.ant-col-2 {
  width: 11.1%;
}
</style>
