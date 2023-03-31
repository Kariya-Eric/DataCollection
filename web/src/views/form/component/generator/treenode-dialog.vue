<template>
  <div>
    <a-modal
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @close="onClose"
    >
      <a-row :gutter="0">
        <a-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="small"
          laba-width="100px"
        >
          <a-col :span="24">
            <a-form-item
              label="选项名"
              prop="label"
            >
              <a-input
                v-model="formData.label"
                placeholder="请输入选项名"
                clearable
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="选项值"
              prop="value"
            >
              <a-input
                v-model="formData.value"
                placeholder="请输入选项值"
                clearable
              >
                <a-select
                  slot="append"
                  v-model="dataType"
                  :style="{width: '100px'}"
                >
                  <a-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </a-select>
              </a-input>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div slot="footer">
        <a-button
          type="primary"
          @click="handelConfirm"
        >
          确定
        </a-button>
        <a-button @click="close">
          取消
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { isNumberStr } from '../utils/index'
import { getTreeNodeId, saveTreeNodeId } from '../utils/db'

const id = getTreeNodeId()

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: '请输入选项名',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入选项值',
            trigger: 'blur'
          }
        ]
      },
      dataType: 'string',
      dataTypeOptions: [
        {
          label: '字符串',
          value: 'string'
        },
        {
          label: '数字',
          value: 'number'
        }
      ]
    }
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    'formData.value': function (val) {
      this.dataType = isNumberStr(val) ? 'number' : 'string'
    },
    id(val) {
      saveTreeNodeId(val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      }
    },
    onClose() {},
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        if (this.dataType === 'number') {
          this.formData.value = parseFloat(this.formData.value)
        }
        this.formData.id = this.id++
        this.$emit('commit', this.formData)
        this.close()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
