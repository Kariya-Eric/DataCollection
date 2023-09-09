<template>
  <div>
    <el-drawer :append-to-body="true" vif="visible" :visible="visible" @close="onClose" :show-close="false" size="80%">
      <div slot="title" class="card-title">
        <span>表单预览</span>
        <div class="card-title-button">
          <el-button @click="onClose"><svg-icon icon-class="返回" />返回</el-button>
        </div>
      </div>
      <form-view :formConf="formConf" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      formConf: {}
    }
  },

  methods: {
    show(formConf) {
      this.formConf = formConf
      this.visible = true
    },

    onClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss"></style>
