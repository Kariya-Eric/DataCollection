<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="学校设置">
        <keep-alive>
          <city-school />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="文章设置">
        <keep-alive>
          <category-setting />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CitySchool from './components/cityschool';
import CategorySetting from './components/categorysetting';
export default {
  components: { CitySchool, CategorySetting }

};
</script>
