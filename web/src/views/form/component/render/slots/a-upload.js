export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (conf['list-type'] === 'picture-card') {
      list.push(<i class="a-icon-plus"></i>)
    } else {
      list.push(<a-button size="small" type="primary" icon="el-icon-upload">{config.buttonText}</a-button>)
    }
    if (config.showTip) {
      list.push(
        <div slot="tip" class="el-upload__tip">只能上传不超过 {config.fileSize}{config.sizeUnit} 的{conf.accept}文件</div>
      )
    }
    return list
  }
}
