<template>
  <a-row :gutter="12">
    <a-col :span="12">
      <a-card>
        <p>123</p>
      </a-card>
    </a-col>
    <a-col :span="2" v-for="(item, i) in titles" :key="i">
      <a-card>
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

<style></style>
