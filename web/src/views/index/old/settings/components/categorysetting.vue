<template>
  <div style="padding: 20px 0;">
    <el-row style="display: flex;">
      <el-col :span="3">
        <el-menu>
          <el-menu-item v-for="(item, index) in lstCategories" :key="index" :index="item.categoryName" @click="handleSelCategory(item)">
            <span slot="title">{{ item.categoryName }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col v-if="curCategory != null" :span="21" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex;">
          <el-card v-for="(item, index) in curCategory.subCategories" :key="index" shadow="hover" class="subcategory-card">
            {{ item }} <i class="el-icon-close" @click="handleDelSubcategory(item)" />
          </el-card>
        </div>
        <div>
          <div style="text-align: center;">
            <el-button type="primary" @click="handleAddSubcategory">添加子类别</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { getCategories, deleteSubcategory, addSubCategory } from '@/api/article';
export default {
  name: 'CategorySetting',
  data() {
    return {
      lstCategories: [],
      curCategory: null
    };
  },
  created() {
    this.getLstCategories();
  },
  methods: {
    async getLstCategories() {
      await getCategories().then(response => {
        this.lstCategories = response;
        console.log(this.lstCategories);
      });
    },
    handleSelCategory(category) {
      this.curCategory = category;
    },
    handleAddSubcategory() {
      this.$prompt('请输入子类别名称', '添加子类别', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入'
      }).then(({ value }) => {
        if (this.curCategory.subCategories.includes(value)) {
          this.$message({ message: '该子类别已存在', type: 'error' });
          return;
        }
        addSubCategory(this.curCategory.id, value).then(res => {
          this.$message({ message: '增加成功', type: 'success' });
          this.getLstCategories().then(() => {
            this.curCategory = this.lstCategories.filter(c => c.id === this.curCategory.id)[0];
          });
        });
        this.$message({
          type: 'success',
          message: '添加成功'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    handleDelSubcategory(item) {
      console.log('deleting...' + item);
      this.$confirm('删除子类目可能会对现有文章造成影响, 您了解该操作造成的后果。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSubcategory(this.curCategory.id, item).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.getLstCategories().then(() => {
              this.curCategory = this.lstCategories.filter(c => c.id === this.curCategory.id)[0];
            });
          });
        })
        .catch();
    }
  }
};
</script>
<style>
.el-icon-close:hover {
    border-radius: 50%;
    background-color: #409EFF;
    color: #fff;
}

.subcategory-card {
  margin: 20px 10px;
  padding: 0 20px;
}
</style>

