<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="#" target="_self">数据采集系统</a>
      <a href="#" target="_self">DataCollection</a>
      <a href="#" target="_self">@Kariya</a>
    </template>
    <template v-slot:copyright>
      <a href="#" target="_self">Copyright &copy; 2023 ~ 2024</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter,
  },
}
</script>
