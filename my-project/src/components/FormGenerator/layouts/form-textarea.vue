<template>
  <a-popover trigger="contextmenu" v-model="visible" :placement="position" overlayClassName="input-pop">
    <div slot="title">
      <span style="float: right" title="关闭">
        <a-icon type="close" @click="visible = false" />
      </span>
    </div>
    <a-input :value="inputContent" :disabled="disabled" @change="handleInputChange" :placeholder="placeholder">
      <a-icon slot="suffix" type="fullscreen" @click.stop="pop" />
    </a-input>
    <div slot="content">
      <a-textarea ref="textarea" :value="inputContent" :disabled="disabled" @change="handleInputChange" :style="{ height: height + 'px', width: width + 'px' }" />
    </div>
  </a-popover>
</template>

<script>
export default {
  name: 'FormTextarea',
  props: {
    position: {
      type: String,
      default: 'right',
      required: false
    },
    height: {
      type: Number,
      default: 150,
      required: false
    },
    width: {
      type: Number,
      default: 350,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    popContainer: {
      type: String,
      default: '',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      visible: false,
      inputContent: ''
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function () {
        if (this.value && this.value.length > 0) {
          this.inputContent = this.value
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    handleInputChange(event) {
      this.inputContent = event.target.value
      this.$emit('change', this.inputContent)
    },
    pop() {
      // disabled 不弹窗
      if (this.disabled) {
        return
      }
      this.visible = true
      this.$nextTick(() => this.$refs.textarea.focus())
    }
  }
}
</script>

<style scoped></style>
