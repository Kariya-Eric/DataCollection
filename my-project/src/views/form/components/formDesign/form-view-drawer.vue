<template>
  <div>
    <a-drawer v-if="visible" :visible="visible" width="80%" @close="onClose">
      <form-view :formConf="formConf" />
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'FormViewDrawer',
  data() {
    return {
      visible: false,
      formConf: {}
    }
  },

  methods: {
    show(formConf) {
      this.formConf = JSON.parse(JSON.stringify(formConf))
      this.visible = true
    },

    onClose() {
      this.visible = false
    }
  }
}
</script>

<style></style>
