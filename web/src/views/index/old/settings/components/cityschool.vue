<template>
  <div style="padding: 20px 0;">
    <el-form ref="form" :inline="true" label-width="120px">
      <el-form-item>
        <el-button type="primary" @click="createCity">添加城市</el-button>
        <el-button type="danger" @click="removeCity">删除城市</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      :data="listDisplay"
      :expand-on-click-node="false"
      :props="defaultProps"
      node-key="name"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.id !== undefined"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            添加
          </el-button>
          <el-button
            v-if="data.id === undefined"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import {
  getCities,
  addSchool,
  delSchool,
  addCity,
  delCity
} from '@/api/account';
export default {
  name: 'CitySchool',
  data() {
    return {
      inpName: '',
      listCitySchool: [],
      listDisplay: [],
      defaultProps: {
        label: 'name',
        children: 'schools'
      },
      selItem: null,
      expandKeys: []
    };
  },
  watch: {
    listCitySchool: function(val) {
      this.updateDisplay(val);
    }
  },
  created() {
    this.getCitySchool();
  },
  methods: {
    getCitySchool() {
      getCities().then(response => {
        console.log(response);
        this.listCitySchool = response;
      });
    },
    updateDisplay(val) {
      this.listDisplay = [];
      val.map(city => {
        const children = [];
        city.schools.map(s => {
          children.push({ name: s });
        });
        this.listDisplay.push({
          id: city.id,
          name: city.name,
          schools: children
        });
      });
      console.log(this.listDisplay);
    },
    append(data) {
      console.log(data);
      this.$prompt('请输入学校名称', '添加', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入'
      }).then(({ value }) => {
        if (this.listCitySchool.filter(cs => cs.id === data.id)[0].schools.includes(value)) {
          this.$message({ message: '该学校已存在', type: 'error' });
          return;
        }
        addSchool(data.id, value).then(res => {
          this.$message({ message: '增加成功', type: 'success' });
          this.listCitySchool.map(cs => {
            if (cs.id === data.id) {
              cs.schools.push(value);
            }
          });
          const newChild = { name: value };
          if (!data.schools) {
            this.$set(data, 'schools', []);
          }
          data.schools.push(newChild);
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

    remove(node, data) {
      var cityid = node.parent.data.id;
      delSchool(cityid, data.name).then(res => {
        this.$message({ message: '删除成功', type: 'success' });
        this.listCitySchool.map(cs => {
          if (cs.id === cityid) {
            cs.schools = cs.schools.filter(s => s !== data.name);
          }
        });
        console.log(this.listCitySchool);

        this.updateDisplay(this.listCitySchool);
      });
    },

    createCity() {
      this.$prompt('请输入城市名称', '添加', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '城市名不能为空'
      }).then(({ value }) => {
        if (this.listCitySchool.filter(cs => cs.name === value).length > 0) {
          this.$message({ message: '该城市已存在', type: 'error' });
          return;
        }
        addCity(value).then(res => {
          this.$message({ message: '增加成功', type: 'success' });
          this.getCitySchool();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    removeCity() {
      console.log(this.selItem);
      if (this.selItem === null || !this.selItem.schools) {
        this.$message({ message: '请选择要删除的城市', type: 'error' });
        return;
      }
      this.$confirm('此操作将永久删除该城市及其学校, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCity(this.selItem.id).then(() => {
            this.$message({ message: '增加成功', type: 'success' });
            this.getCitySchool();
          });
        })
        .catch();
    },
    handleNodeClick(item) {
      this.selItem = item;
    }
  }
};
</script>

<style>
</style>
