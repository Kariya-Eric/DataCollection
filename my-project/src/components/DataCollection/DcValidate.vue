<template>
  <div class="valid">
    <div class="title">{{ title }}</div>
    <a-table rowKey="msg" :columns="columns" :data-source="dataSource" :pagination="false"> </a-table>
  </div>
</template>

<script>
export default {
  name: 'DcValidate',
  props: {
    name: {
      type: String,
      default: ''
    },
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    title() {
      return `组件【${this.name}】 出错信息`
    },
    dataSource() {
      return Object.keys(this.message).map(key => {
        let msg = this.message[key]
        let str = msg
          .map(m => {
            let arr = m.split('!^')
            return `【${arr[0]}】 ${arr[1]}`
          })
          .join(';')
        return { msg: `第 ${key} 行：${str}` }
      })
    }
  },
  data() {
    return {
      columns: [{ dataIndex: 'msg', title: '出错信息' }]
    }
  }
}
</script>

<style lang="less" scoped>
.valid {
  margin: 24px 0px 48px 24px;
  .title {
    margin-bottom: 12px;
    color: red;
  }
}
</style>
