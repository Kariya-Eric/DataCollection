// 用户无操作一小时失效自动退出
import storage from 'store'
import store from '@/store'
import { Modal } from 'ant-design-vue'
import { refreshToken } from '@/api/login'
import { USER_INFO } from '@/store/mutation-types'

let lastTime = new Date().getTime()
let currentTime = new Date().getTime()
let timeOut = 3000 //设置超时时间: 1h

window.onload = function () {
  window.document.onmousedown = function () {
    storage.set('lastTime', new Date().getTime())
  }
}

function checkTimeout() {
  currentTime = new Date().getTime() //更新当前时间
  lastTime = storage.get('lastTime')
  if (currentTime - lastTime > timeOut) {
    //判断是否超时
    // 清除storage的数据(登陆信息和token)
    storage.remove(lastTime)
    Modal.confirm({
      title: '登录已过期',
      content: '登陆信息已失效，请重新登录',
      icon: 'exclamation-circle',
      cancelButtonProps: { style: { display: 'none' } },
      okText: '重新登录',
      mask: false,
      onOk: () => {
        store.dispatch('Logout').then(() => {
          try {
            let path = window.document.location.pathname
            if (path != '/' && path.indexOf('/user/login') == -1) {
              window.location.reload()
            }
          } catch (e) {
            window.location.reload()
          }
        })
      }
    })
  } else {
    //刷新token
    refreshToken({ account: USER_INFO.account }).then(res => {
      console.log(res)
    })
  }
}

/* 定时器 间隔30秒检测是否长时间未操作页面 */
window.setInterval(checkTimeout, 3000)
