export const DataCollectionModalMixin = {
  data() {
    return {
      loading: false,
      visible: false,
      title: '编辑',
      disabled: false,
      layout: {
        labelCol: { style: 'width: 85px; display: inline-block; vertical-align: inherit;' },
        wrapperCol: { style: 'width: calc(100% - 85px); display: inline-block;' }
      },
      layoutForSix: {
        labelCol: { style: 'width: 110px; display: inline-block; vertical-align: inherit;' },
        wrapperCol: { style: 'width: calc(100% - 110px); display: inline-block;' }
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
