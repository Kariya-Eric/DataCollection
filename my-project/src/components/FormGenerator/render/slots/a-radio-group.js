export default {
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach((item) =>
      list.push(<a-radio value={item.value}>{item.label}</a-radio>)
    );
    return list;
  },
};
