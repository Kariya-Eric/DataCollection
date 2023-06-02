<template>
  <div class="app-main">
    <section>
      <transition name="fade-transform" mode="out-in">
        <!-- or name="fade" -->
        <!-- <router-view :key="key"></router-view> -->
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </section>
    <app-footer />
  </div>
</template>

<script>
import AppFooter from "./AppFooter";

export default {
  name: "AppMain",
  components: {
    AppFooter,
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  background-color: rgb(240, 242, 245);
  // padding: 24px;
}
</style>
