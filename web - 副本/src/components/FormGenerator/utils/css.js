const styles = {
  "el-input-number":
    ".el-input-number.is-controls-right .el-input__inner{text-align: left;} \n .el-input__inner::placeholder {text-align: left;}",
};

function addCss(cssList, el) {
  const css = styles[el.__config__.tag];
  css && cssList.indexOf(css) === -1 && cssList.push(css);
  if (el.__config__.children) {
    el.__config__.children.forEach((el2) => addCss(cssList, el2));
  }
}

export function makeUpCss(conf) {
  const cssList = [];
  conf.fields.forEach((el) => addCss(cssList, el));
  return cssList.join("\n");
}
