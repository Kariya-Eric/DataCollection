<template>
  <div class="main-form">
    <el-form label-width="120px" size="small" ref="taskForm" :model="taskForm" :rules="taskFormRules">
      <el-row>
        <h2>学校基本信息</h2>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="taskForm.type" clearable style="width: 100%" placeholder="请选择任务类型">
              <el-option label="教学基本状态数据" value="教学基本状态数据"></el-option>
              <el-option label="其他数据" value="其他数据"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="填报开始时间" prop="statisticsStartTime">
            <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" v-model="taskForm.statisticsStartTime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="填报截止时间" prop="statisticsEndTime">
            <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" v-model="taskForm.statisticsEndTime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="统计时间" prop="year">
            <el-date-picker style="width: 100%" value-format="yyyy" type="year" format="yyyy" v-model="taskForm.year" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学年">
            <el-input v-model="taskForm.schoolYear" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自然年">
            <el-input v-model="taskForm.year" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="taskForm.type == '教学基本状态数据'">
        <el-row>
          <h2>学校专业类别信息</h2>
        </el-row>
        <el-row>
          <el-alert
            show-icon
            :closable="false"
            type="warning"
            title="为配合专业类国家三级认证工作，请确认本校是否包含以下专业类（2022年仅对师范类、医学、工科类专业进行确认）。"
          />
        </el-row>
        <el-form-item prop="professionalCategory">
          <extra-switch v-model="taskForm.professionalCategory" />
        </el-form-item>
      </template>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="save" :loading="loading">保存</el-button>
      <el-button type="primary" @click="next" :loading="loading">下一步</el-button>
      <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import { initTask, updateTask } from '@/api/task'
import ExtraSwitch from './extra-switch'

export default {
  name: 'AddTaskStepFirst',
  props: ['task', 'years'],
  components: { ExtraSwitch },
  data() {
    return {
      taskForm: this.task,
      loading: false,
      taskFormRules: {
        type: [{ required: true, message: '请选择任务类型' }],
        name: [{ required: true, message: '请输入任务名称' }],
        statisticsStartTime: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (new Date(value) < new Date()) {
                  callback(new Error('填报开始时间需大于当前时间'))
                }
                if (value > this.taskForm.statisticsEndTime) {
                  callback(new Error('开始时间不能大于结束时间'))
                }
                callback()
              }
              callback(new Error('请选择填报开始时间'))
            }
          }
        ],
        statisticsEndTime: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value < this.taskForm.statisticsStartTime) {
                  callback(new Error('结束时间不能小于开始时间'))
                }
                callback()
              }
              callback(new Error('请选择填报结束时间'))
            }
          }
        ],
        professionalCategory: [{ required: true, message: '请至少选择一项' }]
      }
    }
  },

  watch: {
    'taskForm.year'(newVal) {
      if (newVal) {
        this.taskForm.schoolYear = newVal + '-' + (parseInt(newVal) + 1)
      } else {
        this.taskForm.schoolYear = ''
      }
    },
    'taskForm.type'(newVal) {
      if (newVal == '其他数据') {
        this.taskForm.professionalCategory = ''
      }
    }
  },

  methods: {
    async next() {
      try {
        await this.$refs.taskForm.validate()
        await this.save()
        this.$emit('change', 1)
      } catch (e) {
        return
      }
    },

    async save() {
      try {
        await this.$refs.taskForm.validate()
        if (this.taskForm.id) {
          //保存
          await this.updateTask()
        } else {
          //初始化
          await this.initTask()
          await this.updateTask()
        }
      } catch (e) {
        return
      }
    },

    async initTask() {
      this.loading = true
      await initTask(this.taskForm).then(res => {
        if (res.state) {
          this.taskForm.id = res.value
        } else {
          this.$message.error(res.message)
        }
      })
      this.loading = false
    },

    async updateTask() {
      this.loading = true
      await updateTask(this.taskForm).then(res => {
        if (res.state) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
      this.loading = false
    },

    back() {
      this.$emit('back')
      this.$refs.taskForm.resetFields()
    }
  }
}
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
