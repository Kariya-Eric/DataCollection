<template>
  <div ref="scrollContainer">
    <div :class="`section ${level == 1 ? 'section-main' : ''}`" :id="`section-${item.key}`" v-for="item in documents" :key="item.key">
      <h2>{{ item.title }}</h2>
      <div v-if="item.content" v-html="processedHtmlContent(item)"></div>
      <div v-if="item.children && item.children.length > 0">
        <DocumentTree :documents="item.children" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentTree',
  props: {
    documents: {
      type: Array,
      required: true
    },
    level: Number
  },
  data() {
    return {
      datasource: null
    }
  },
  computed: {
    processedHtmlContent() {
      return data => this.replaceVariables(data.content)
    }
  },
  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      this.table1 = {
        colums: [
          { title: '', dataIndex: 'total' },
          { title: '1.博士后流动站', dataIndex: 'value1' },
          { title: '2.博士学位授权一级学科点', dataIndex: 'value2' },
          { title: '3.博士学位授权二级学科点（不含一级覆盖点）', dataIndex: 'value3' },
          { title: '4.硕士学位授权一级学科点', dataIndex: 'value4' },
          { title: '5.硕士学位授权二级学科点（不含一级覆盖点）', dataIndex: 'value5' }
        ],
        data: [{ total: '合计', value1: '1', value2: '2', value3: '3', value4: '4', value5: '5' }]
      }
    },
    replaceVariables(html) {
      return html.replace(/{{\s*(\w+)\s*}}/g, (match, variable) => {
        if (this[variable]) {
          return this[variable]
        } else {
          return match
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.section {
  color: #4a4c51;
  font-size: 14px;
  line-height: 26px;
  margin-bottom: 30px;
  h2 {
    color: #000;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  /deep/p {
    text-indent: 2em;
    margin-bottom: 10px;
    span {
      text-decoration: underline;
    }
    &.desc {
      color: #666;
      text-indent: 0;
    }
  }
}
.section-main {
  margin-bottom: 0;
  >h2 {
    font-size: 18px;
  }
}
</style>
