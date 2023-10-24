export const DataCollectionModalMixin = {
  data() {
    return {
      loading: false,
      visible: false,
      title: '编辑',
      disabled: false,
      layout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 }
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
