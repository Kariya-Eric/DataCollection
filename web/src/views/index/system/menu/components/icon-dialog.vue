<template>
  <el-dialog :visible="visible" @close="close" append-to-body width="700px">
    <ul>
      <li v-for="icon in icons" :key="icon">
        <span @click="chooseIcon(icon)">
          <svg-icon :icon-class="icon" width="30px" height="30px" :class="{ active: activeIndex == icon }" />
        </span>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
const icons = [
  'eye',
  'email',
  'eyeclose',
  'grid',
  'password',
  'user',
  '表单分配',
  '表单管理-blue',
  '表格',
  '部门',
  '部门备份3',
  '单项选择',
  '单行文本',
  '地址',
  '多项选择',
  '多行文本',
  '返回',
  '分割线',
  '浮动表单',
  '固定表单',
  '基础信息',
  '即将截止',
  '链接',
  '启用中',
  '启用中备份3',
  '日期选择',
  '手机',
  '首页-blue',
  '数据采集',
  '数据采集-blue',
  '数组',
  '停用',
  '完成',
  '未启用',
  '系统管理-blue',
  '下拉选择',
  '已逾期',
  '邮箱'
]
export default {
  name: 'IconDialog',
  data() {
    return {
      visible: false,
      icons,
      activeIndex: ''
    }
  },
  methods: {
    close() {
      this.activeIndex = ''
      this.visible = false
    },
    show() {
      this.visible = true
    },

    chooseIcon(icon) {
      this.activeIndex = icon
      this.choosedIcon = icon
    },

    handleSubmit() {
      if (this.choosedIcon === '') {
        this.$message.warning('尚未选择任何图标')
        return
      }
      this.close()
      this.$emit('choose', this.choosedIcon)
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  max-height: 700px;
  overflow-y: auto;
  padding-left: 0.5rem;
  svg {
    font-size: 1.5rem;
    border: 1px solid #f1f1f1;
    padding: 0.2rem;
    margin: 0.3rem;
    cursor: pointer;
    &.active,
    &:hover {
      border: 1px solid;
      border-radius: 2px;
      border-color: #999797;
      background-color: #c4c4c4;
      color: #fff;
      transition: all 0.3s;
    }
  }
  li {
    list-style: none;
    float: left;
    text-align: center;
    cursor: pointer;
    color: #555;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    position: relative;
    margin: 3px 0;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    padding: 10px 0 0;
  }
}
</style>
