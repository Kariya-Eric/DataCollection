/**
 * 获取指定的 $refs 对象
 * 有时候可能会遇到组件未挂载到页面中的情况，导致无法获取 $refs 中的某个对象
 * 这个方法可以等待挂载完成之后再返回 $refs 的对象，避免报错
 **/
export function getRefPromise(vm, name) {
  return new Promise(resolve =>
    (function next() {
      let ref = vm.$refs[name]
      if (ref) {
        resolve(ref)
      } else {
        setTimeout(() => {
          next()
        }, 10)
      }
    })()
  )
}
