<template>
  <div style="margin: 24px 24px 0;">
    个人中心
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapState('user', ['userInfo', 'roles'])
  },
  beforeCreate() {
    console.log('before create');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('before mount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('before update');
  },
  updated() {
    console.log('updated');
  },
  beforeDestroy() {
    console.log('before destroy');
  },
  destroyed() {
    console.log('destroyed');
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
