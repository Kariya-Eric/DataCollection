export const DataCollectionModalMixin = {
  data() {
    return {
      loading: false,
      visible: false,
      title: '编辑',
      disabled: false,
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      model: {}
    }
  },
  methods: {
    handleCancel() {
      this.close()
    }
  }
}
