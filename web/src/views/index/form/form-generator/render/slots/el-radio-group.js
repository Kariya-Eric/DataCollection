export default {
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach((item) =>
      list.push(<el-radio label={item.value}>{item.label}</el-radio>)
    );
    return list;
  },
};
