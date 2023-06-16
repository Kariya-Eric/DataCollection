import { isArray } from "util";
import { exportDefault, titleCase, deepClone } from "../utils/index";
import ruleTrigger from "./ruleTrigger";

let confGlobal;

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig) {
  confGlobal = formConfig = deepClone(formConfig);
  const dataList = [];
  const ruleList = [];
  const optionsList = [];
  const propsList = [];
  const methodList = mixinMethod();
  const created = [];

  formConfig.fields.forEach((el) => {
    buildAttributes(
      el,
      dataList,
      ruleList,
      optionsList,
      methodList,
      propsList,
      created
    );
  });

  const script = buildexport(
    formConfig,
    dataList.join("\n"),
    ruleList.join("\n"),
    optionsList.join("\n"),
    propsList.join("\n"),
    methodList.join("\n"),
    created.join("\n")
  );
  confGlobal = null;
  return script;
}

// 构建组件属性
function buildAttributes(
  scheme,
  dataList,
  ruleList,
  optionsList,
  methodList,
  propsList,
  created
) {
  const config = scheme.__config__;
  const slot = scheme.__slot__;
  buildData(scheme, dataList);
  buildRules(scheme, ruleList);

  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList);
    if (config.dataType === "dynamic") {
      const model = `${scheme.__vModel__}Options`;
      const options = titleCase(model);
      const methodName = `get${options}`;
      buildOptionMethod(methodName, model, methodList, scheme);
      callInCreated(methodName, created);
    }
  }

  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList);
  }

  // 构建子级组件属性
  if (config.children) {
    config.children.forEach((item) => {
      buildAttributes(
        item,
        dataList,
        ruleList,
        optionsList,
        methodList,
        propsList,
        created
      );
    });
  }
}

// 在Created调用函数
function callInCreated(methodName, created) {
  created.push(`this.${methodName}()`);
}

// 混入处理函数
function mixinMethod() {
  const list = [];
  let hasTable = false;
  for (let i = 0; i < confGlobal.fields.length; i++) {
    if (confGlobal.fields[i].__config__.tag === "customEditTable") {
      hasTable = true;
      break;
    }
  }
  const methods = {
    submitForm: hasTable
      ? `submitForm() {
      this.$refs['${confGlobal.formRef}'].validate(valid => {
        if(!valid) return
        // TODO 提交表单
        this.$message.success('表单验证OK')
        console.log('form',this.${confGlobal.formModel})
      })
    },`
      : `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
          this.$message.success('表单验证OK')
          console.log('form',this.${confGlobal.formModel})
        })
      },`,
    resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
  };
  if (methods) {
    Object.keys(methods).forEach((key) => {
      list.push(methods[key]);
    });
  }

  return list;
}

// 构建data
function buildData(scheme, dataList) {
  if (scheme.__vModel__ === undefined) return;
  const vmodel = scheme.__config__.tag === "el-checkbox-group" ? `[]` : `undefined`
  dataList.push(`${scheme.__vModel__}: ${vmodel},`);
}

// 构建校验规则
function buildRules(scheme, ruleList) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const rules = [];
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = isArray(config.defaultValue) ? "type: 'array'," : "";
      let message = isArray(config.defaultValue)
        ? `请至少选择一个${config.label}`
        : scheme.placeholder;
      if (message === undefined) message = `${config.label}不能为空`;
      rules.push(
        `{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]
        }' }`
      );
    }
    if (config.tag === "el-input") {
      if (scheme.allowChar) {
        rules.push(
          `{ pattern: /^[^\\u4E00-\\u9FA5]+$/, message : '${config.label}中不能包含汉字' , trigger : 'blur' }`
        );
      }
    }
    if (config.tag === "customLink") {
      rules.push(
        `{ pattern: /^[^\\u4E00-\\u9FA5]+$/, message : '请输入正确的${config.label}' , trigger : 'blur' }`
      );
    }
    if (config.tag === "customPhone") {
      if (scheme.isMobile) {
        rules.push(
          `{ pattern: /^(\\+\\d{2}-)?0\\d{2,3}-\\d{7,8}$/ , message : '请输入正确的电话号码' , trigger : 'blur' }`
        );
      } else {
        rules.push(
          `{ pattern:  /^(\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})$/ , message : '请输入正确的手机号' , trigger : 'blur' }`
        );
      }
    }
    if (config.tag === "customMail") {
      rules.push(
        `{ type: 'email' , message : '请输入正确的邮箱' , trigger : 'blur' }`
      );
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(",")}],`);
  }
  if (config.tag === "customEditTable") {
    rules.push(`{ validator : (rule,value,callback) => {
      let result=this.$refs.customTable_${config.formId}.validateTable();
      if(result===0){
        callback();
      }else{
        let errorMsg=result===1?'${config.label}至少需要一条数据':'${config.label}中存在不合法数据'
        callback(new Error(errorMsg));
      }
    }}`);
    ruleList.push(`${scheme.__vModel__}: [${rules.join(",")}],`);
  }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return;
  // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  let { options } = scheme;
  if (!options) options = scheme.__slot__.options;
  if (scheme.__config__.dataType === "dynamic") {
    options = [];
  }
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`;
  optionsList.push(str);
}

function buildProps(scheme, propsList) {
  const str = `${scheme.__vModel__}Props: ${JSON.stringify(
    scheme.props.props
  )},`;
  propsList.push(str);
}

function buildOptionMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__;
  const str = `${methodName}() {
    // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
    this.$axios({
      method: '${config.method}',
      url: '${config.url}'
    }).then(resp => {
      var { data } = resp
      this.${model} = data.${config.dataKey}
    })
  },`;
  methodList.push(str);
}

// js整体拼接
function buildexport(
  conf,
  data,
  rules,
  selectOptions,
  props,
  methods,
  created
) {
  const str = `${exportDefault}{
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${selectOptions}
      ${props}
    }
  },
  created () {
    //处理多选的表单验证问题
    this.$nextTick(()=>this.resetForm());
    ${created}
  },
  methods: {
    ${methods}
  }
}`;
  return str;
}
