<template>
  <div style="margin: 24px 24px 0;">
    <el-card shadow="always" class="app-card">
      <el-row :gutter="48">
        <el-col :md="4" style="padding: 20px 30px;">
          <!-- el-menu -->
          <el-menu default-active="1">
            <el-menu-item index="1" @click="handleClickMenu(1)">
              <span slot="title">基本设置</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handleClickMenu(2)">
              <span slot="title">安全设置</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handleClickMenu(3)">
              <span slot="title">个性化</span>
            </el-menu-item>
            <el-menu-item index="4" @click="handleClickMenu(4)">
              <span slot="title">账户绑定</span>
            </el-menu-item>
            <el-menu-item index="5" @click="handleClickMenu(5)">
              <span slot="title">新消息通知</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :md="20">
          <basic-setting v-if="curMenuIndex === 1" />
          <security-setting v-if="curMenuIndex === 2" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import BasicSetting from './components/basicsetting';
import SecuritySetting from './components/securitysetting';

export default {
  components: { BasicSetting, SecuritySetting },
  data() {
    return {
      curMenuIndex: 1
    };
  },
  methods: {
    handleClickMenu(index) {
      this.curMenuIndex = index;
    }
  }
};
</script>
