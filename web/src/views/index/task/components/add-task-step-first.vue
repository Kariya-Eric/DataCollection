<template>
  <div class="main-form">
    <el-form
      label-width="120px"
      size="small"
      ref="basicForm"
      :model="basicForm"
      :rules="basicRules"
    >
      <el-row>
        <h2>学校基本信息</h2>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务类型" prop="type">
            <el-select
              v-model="basicForm.type"
              clearable
              style="width: 100%"
              placeholder="请选择任务类型"
            >
              <el-option
                label="教学基本状态数据"
                value="教学基本状态数据"
              ></el-option>
              <el-option label="其他数据" value="其他数据"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="basicForm.name" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="填报开始时间" prop="statisticsStartTime">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd"
              v-model="basicForm.statisticsStartTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="填报截止时间" prop="statisticsEndTime">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd"
              v-model="basicForm.statisticsEndTime"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学年" prop="schoolYear">
            <el-select
              v-model="basicForm.schoolYear"
              style="width: 100%"
              clearable
              placeholder="请选择学年"
              @change="shoolYearChange"
            >
              <el-option
                v-for="(opt, index) in schoolYearList"
                :label="opt"
                :key="index"
                :value="opt"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自然年">
            <el-input v-model="basicForm.year" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width="150px" v-if="basicForm.type == '教学基本状态数据'">
      <el-row>
        <h2>学校专业类别信息</h2>
      </el-row>
      <el-row>
        <h3>
          为配合专业类国家三级认证工作，请确认本校是否包含以下专业类（2022年仅对师范类、医学、工科类专业进行确认）。
        </h3>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="师范类">
            <el-switch v-model="advancedForm.first" />
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="医学专业">
            <el-switch v-model="advancedForm.second" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item label="工科类">
            <el-switch v-model="advancedForm.third" />
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="人文社科类专业">
            <el-switch v-model="advancedForm.fourth" disabled /><span
              style="margin-left: 12px"
              >暂未开放</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item label="农学类专业">
            <el-switch v-model="advancedForm.fifth" disabled /><span
              style="margin-left: 12px"
              >暂未开放</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="理学类专业">
            <el-switch v-model="advancedForm.sixth" disabled /><span
              style="margin-left: 12px"
              >暂未开放</span
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button
        type="primary"
        size="small"
        @click="save(false)"
        :loading="loading"
        >保存</el-button
      >
      <el-button type="primary" @click="frontStep" size="small"
        >下一步</el-button
      >
      <el-button @click="back" size="small">返回</el-button>
    </div>
  </div>
</template>

<script>
import { initTask, updateTask, getTask } from "@/api/task";
export default {
  name: "AddTaskStepFirst",
  props: ["taskId"],
  data() {
    return {
      basicForm: {},
      advancedForm: {
        first: true,
        second: true,
        third: true,
        fourth: false,
        fifth: false,
        sixth: false,
      },
      loading: false,
      basicRules: {
        type: [{ required: true, message: "请选择任务类型" }],
        name: [{ required: true, message: "请输入任务名称" }],
        statisticsStartTime: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value > this.basicForm.statisticsEndTime) {
                  callback(new Error("开始时间不能大于结束时间"));
                }
                callback();
              }
              callback(new Error("请选择统计开始时间"));
            },
          },
        ],
        statisticsEndTime: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value < this.basicForm.statisticsStartTime) {
                  callback(new Error("结束时间不能小于开始时间"));
                }
                callback();
              }
              callback(new Error("请选择统计结束时间"));
            },
          },
        ],
        schoolYear: [{ required: true, message: "请选择学年" }],
      },
    };
  },
  watch: {
    taskId: {
      handler(newVal) {
        if (newVal !== undefined) {
          getTask(newVal).then((res) => {
            if (res.state) {
              this.basicForm = res.value;
              const { professionalCategory } = res.value;
              this.advancedForm.first =
                professionalCategory.indexOf("师范类") != -1;
              this.advancedForm.second =
                professionalCategory.indexOf("医学专业") != -1;
              this.advancedForm.third =
                professionalCategory.indexOf("工科类") != -1;
            }
          });
        } else {
          this.basicForm = {};
          this.advancedForm = {
            first: true,
            second: true,
            third: true,
            fourth: false,
            fifth: false,
            sixth: false,
          };
        }
      },
      immediate: true,
    },
  },
  computed: {
    schoolYearList() {
      let startYear = 2018;
      let nowYear = new Date().getFullYear();
      let yearList = [];
      for (let i = startYear; i < nowYear; i++) {
        let option = `${i}-${i + 1}`;
        yearList.push(option);
      }
      return yearList;
    },
  },
  methods: {
    shoolYearChange(val) {
      this.basicForm.year = val.substring(0, 4);
    },

    save(flag) {
      if (this.taskId) {
        this.updateTask(flag);
      } else {
        this.getTaskId(flag);
      }
    },

    frontStep() {
      this.save(true);
    },

    getTaskId(flag) {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          initTask(this.basicForm)
            .then((res) => {
              if (res.state) {
                this.basicForm.id = res.value;
                this.updateTask(flag);
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => (this.loading = false));
        }
      });
    },

    updateTask(flag) {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let professionalCategory = "";
          if (this.basicForm.type == "教学基本状态数据") {
            professionalCategory += this.advancedForm.first ? "师范类," : "";
            professionalCategory += this.advancedForm.second ? "医学专业," : "";
            professionalCategory += this.advancedForm.third ? "工科类," : "";
            professionalCategory = professionalCategory.substring(
              0,
              professionalCategory.length - 1
            );
          }
          let params = { ...this.basicForm, professionalCategory };
          updateTask(params)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
                this.$emit("initTask", this.basicForm.id);
                if (flag) {
                  this.$emit("change", 1);
                }
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => (this.loading = false));
        }
      });
    },

    back() {
      this.$emit("back");
      this.$refs.basicForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-form {
  width: 50%;
  margin: auto;
}
.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>
