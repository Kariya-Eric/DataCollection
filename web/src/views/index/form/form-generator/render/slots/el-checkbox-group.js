export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => list.push(<el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox>))
    return list
  }
}
