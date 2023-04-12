<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ nickName }}</div>
    <div class="dashboard-text">
      roles:
      <span v-for="(role,key) in roles" :key="key">{{ role }}</span>
    </div> -->
    <span>欢迎您 {{ userInfo.username }} !</span>
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
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
