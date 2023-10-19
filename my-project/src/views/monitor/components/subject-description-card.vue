<template>
  <a-card title="专业概况">
    <a-row :gutter="12" v-for="(info, index) in subjectInfo" :key="index">
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
  name: 'SubjectDescriptionCard',
  data() {
    return {
      subjectInfo: [
        [
          { title: '本科专业(个)', value: 90 },
          { title: '专业大类(个)', value: 8 }
        ],
        [
          { title: '新专业(个)', value: 10 },
          { title: '招生专业(个)', value: 72 }
        ],
        [
          { title: '省级一流专业(个)', value: '21' },
          { title: '专业覆盖学科门类(个)', value: '9' }
        ],
        [
          { title: '国家一流专业(个)', value: 40 },
          { title: '近三年新增专业(个)', value: 3 }
        ],
        [{ title: '近三年停招专业(个)', value: '14' }]
      ]
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-body {
  height: 430px;
}
</style>
