<template>
  <div>
    <el-popover placement="bottom" width="500">
      <div class="tabContent">
        <el-tabs v-model="activeTabs">
          <el-tab-pane label="全部" name="first">
            <el-scrollbar>
              <ul class="list">
                <li v-for="item in 8" :key="item" class="list-item">
                  <span>你有一条消息待处理！</span>
                </li>
              </ul>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="已读" name="second">123</el-tab-pane>
          <el-tab-pane label="未读" name="third">123</el-tab-pane>
        </el-tabs>
      </div>
      <span class="header-notice" slot="reference">
        <el-badge :value="12">
          <i class="el-icon-bell" style="font-size: 18px; padding: 4px" />
        </el-badge>
      </span>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "HeaderNotice",
  data() {
    return {
      activeTabs: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
.header-notice {
  display: inline-block;
  span {
    vertical-align: initial;
  }
}
/deep/.el-badge__content {
  margin-top: 12px;
}
.tabContent {
  margin: 0 12px 0 12px;
}
.list {
  height: 200px;
  padding: 0;
  margin: 0;
  list-style: none;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #e8f3fe;
    margin: 10px;
  }
}
</style>