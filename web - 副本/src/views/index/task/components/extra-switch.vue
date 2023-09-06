<template>
  <div style="margin-top: 24px">
    <el-row>
      <el-col :span="8">
        <el-switch
          v-model="values[0]"
          :inactive-text="labels[0]"
          :active-value="labels[0]"
          @change="changeFirst"
        />
      </el-col>
      <el-col :span="8">
        <el-switch
          v-model="values[1]"
          :inactive-text="labels[1]"
          :active-value="labels[1]"
          @change="changeSecond"
        />
      </el-col>
      <el-col :span="8">
        <el-switch
          v-model="values[2]"
          :inactive-text="labels[2]"
          :active-value="labels[2]"
          @change="changeThird"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ExtraSwitch",
  props: ["value"],
  data() {
    return {
      labels: ["师范类", "医学专业", "工科类"],
      values: [false, false, false],
    };
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          let array = newVal.split(",");
          array.forEach((item) => {
            let index = this.labels.indexOf(item);
            if (index != -1) {
              this.values[index] = item;
            }
          });
        }
      },
      immediate: true,
    },
  },

  methods: {
    changeFirst(val) {
      this.values[0] = val;
      this.$emit("input", this.values.filter((val) => val != false).join(","));
    },
    changeSecond(val) {
      this.values[1] = val;
      this.$emit("input", this.values.filter((val) => val != false).join(","));
    },
    changeThird(val) {
      this.values[2] = val;
      this.$emit("input", this.values.filter((val) => val != false).join(","));
    },
  },
};
</script>

<style>
</style>