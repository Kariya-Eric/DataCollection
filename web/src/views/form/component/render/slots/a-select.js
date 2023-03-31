export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      list.push(<a-select-option label={item.label} value={item.value} disabled={item.disabled}></a-select-option>)
    })
    return list
  }
}
