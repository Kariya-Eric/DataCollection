<script>
import { OptionGroup } from 'element-ui'

export default {
  extends: OptionGroup,
  name: 'GroupOption',
  mounted() {
    const select = this.$el
    // 思路二的实现，隐藏文本
    const titleDom = select.querySelector('.el-select-group__title')
    titleDom.style.display = 'none'
  }
}
</script>

<style scoped lang="scss">
.el-select-group__title {
  cursor: pointer;
  font-size: 15px;
  color: #606266;
  font-weight: bold;
  &:hover {
    color: #409eff;
  }
}
</style>
