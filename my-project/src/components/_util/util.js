/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty(children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

export function getClass(ele) {
  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }
  const tempCls = data.class || {}
  const staticClass = data.staticClass
  let cls = {}
  staticClass &&
    staticClass.split(' ').forEach(c => {
      cls[c.trim()] = true
    })
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => {
      cls[c.trim()] = true
    })
  } else if (Array.isArray(tempCls)) {
    classNames(tempCls)
      .split(' ')
      .forEach(c => {
        cls[c.trim()] = true
      })
  } else {
    cls = { ...cls, ...tempCls }
  }
  return cls
}

export function getStyle(ele, camel) {
  getClass(ele)

  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }

  let style = data.style || {}
  let staticStyle = data.staticStyle
  staticStyle = staticStyle ? objectCamelize(data.staticStyle) : {}
  if (typeof style === 'string') {
    style = parseStyleText(style, camel)
  } else if (camel && style) {
    // 驼峰化
    style = objectCamelize(style)
  }
  return { ...staticStyle, ...style }
}

function classNames() {
  let classes = []

  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i]
    if (!arg) continue

    let argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg) && arg.length) {
      let inner = classNames.apply(null, arg)
      if (inner) {
        classes.push(inner)
      }
    } else if (argType === 'object') {
      for (let key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }
  return classes.join(' ')
}

const camelizeRE = /-(\w)/g

function camelize(str) {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

function objectCamelize(obj) {
  let res = {}
  Object.keys(obj).forEach(k => (res[camelize(k)] = obj[k]))
  return res
}

function parseStyleText(cssText = '', camel) {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim()
        res[k] = tmp[1].trim()
      }
    }
  })
  return res
}
