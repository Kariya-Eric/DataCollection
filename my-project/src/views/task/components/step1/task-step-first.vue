<template>
  <div class="main-form">
    <a-spin :spinning="loading">
      <a-form-model ref="taskForm" :model="taskForm" :rules="taskFormRules" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row>
          <h2>基础信息</h2>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="任务类型" prop="type">
              <a-select v-model="taskForm.type" allowClear placeholder="请选择任务类型">
                <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
                <a-select-option value="其他数据">其他数据</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="任务名称" prop="name">
              <a-input v-model="taskForm.name" placeholder="请输入任务名称" allowClear />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="填报开始时间" prop="statisticsStartTime">
              <dc-date
                format="yyyy-MM-dd"
                v-model="taskForm.statisticsStartTime"
                placeholder="请选择填报开始时间"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24
                  }
                }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="填报截止时间" prop="statisticsEndTime">
              <dc-date
                format="yyyy-MM-dd"
                v-model="taskForm.statisticsEndTime"
                placeholder="请选择填报截止时间"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24
                  }
                }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="统计时间" prop="year">
              <dc-date format="yyyy" mode="year" v-model="taskForm.year" placeholder="请选择统计时间" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="学年">
              <a-input v-model="taskForm.schoolYear" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="自然年">
              <a-input v-model="taskForm.year" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <template v-if="taskForm.type == '教学基本状态数据'">
          <div>
            <a-row>
              <h2>学校专业类别信息</h2>
            </a-row>
            <a-row>
              <a-alert show-icon type="warning" message="为配合专业类国家三级认证工作，请确认本校是否包含以下专业类（2022年仅对师范类、医学、工科类专业进行确认）。" />
            </a-row>
            <a-row>
              <a-form-model-item prop="professionalCategory">
                <extra-switch v-model="taskForm.professionalCategory" />
              </a-form-model-item>
            </a-row>
          </div>
        </template>
      </a-form-model>
      <div class="footer">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button type="primary" @click="next">下一步</a-button>
        <a-popconfirm
          title="当前页面信息有改动，是否确认返回？"
          placement="top"
          :visible="confirmVisible"
          @visibleChange="handleVisibleChange"
          @confirm="back"
          @cancel="confirmVisible = false"
        >
          <a-button>返回</a-button>
        </a-popconfirm>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { initTask, updateTask } from '@/api/task'
import ExtraSwitch from './extra-switch'
export default {
  name: 'TaskStepFirst',
  props: ['task', 'years'],
  components: { ExtraSwitch },
  data() {
    return {
      confirmVisible: false,
      labelCol: { style: 'width: 125px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 150px); display: inline-block;' },
      tempTaskForm: JSON.parse(JSON.stringify(this.task)),
      taskForm: JSON.parse(JSON.stringify(this.task)),
      loading: false,
      taskFormRules: {
        type: [{ required: true, message: '请选择任务类型' }],
        name: [{ required: true, message: '请输入任务名称' }],
        year: [{ required: true, message: '请选择统计时间' }],
        statisticsStartTime: [
          { required: true, message: '请选择填报开始时间' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (new Date(value) <= new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) {
                  callback(new Error('填报开始时间需大于或等于当前时间'))
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
          { required: true, message: '请选择填报结束时间' },
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
        if (this.judgeEdit()) {
          this.$emit('change', 1)
        } else {
          if (this.taskForm.id) {
            //保存
            this.loading = true
            await updateTask(this.taskForm).then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.tempTaskForm = { ...this.taskForm }
                this.$emit('change', 1)
              } else {
                this.$message.error(res.message)
              }
            })
            this.loading = false
          } else {
            //初始化
            await this.initTask()
            this.loading = true
            await updateTask(this.taskForm).then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.tempTaskForm = { ...this.taskForm }
                this.$emit('change', 1)
              } else {
                this.$message.error(res.message)
              }
            })
            this.loading = false
          }
        }
      } catch (e) {
        return
      }
    },

    async save() {
      try {
        await this.$refs.taskForm.validate()
        if (this.taskForm.id) {
          //保存
          this.loading = true
          await updateTask(this.taskForm).then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.tempTaskForm = { ...this.taskForm }
            } else {
              this.$message.error(res.message)
            }
          })
          this.loading = false
        } else {
          //初始化
          await this.initTask()
          this.loading = true
          await updateTask(this.taskForm).then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.tempTaskForm = { ...this.taskForm }
            } else {
              this.$message.error(res.message)
            }
          })
          this.loading = false
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
          this.$emit('initTask', this.taskForm.id)
          this.tempTaskForm = { ...this.taskForm }
        } else {
          this.$message.error(res.message)
        }
      })
      this.loading = false
    },

    handleVisibleChange(visible) {
      if (!visible) {
        this.confirmVisible = false
        return
      }
      if (this.judgeEdit()) {
        this.back()
      } else {
        this.confirmVisible = true
      }
    },

    back() {
      this.$emit('back')
      this.taskForm = {}
      this.$refs.taskForm.clearValidate()
    },

    judgeEdit() {
      let task = { ...this.taskForm }
      Object.keys(task).forEach(key => {
        if (task[key] === '') {
          delete task[key]
        }
        if (!task.type || task.type == '其他数据') {
          task.professionalCategory = ''
        }
      })
      return JSON.stringify(this.tempTaskForm) == JSON.stringify(task)
    }
  }
}
</script>

<style lang="less" scoped>
.main-form {
  width: 55%;
  margin: auto;
  overflow-y: auto;
}
.footer {
  margin-top: 12px;
  text-align: center;
  .ant-btn {
    margin-left: 24px;
  }
}
</style>
