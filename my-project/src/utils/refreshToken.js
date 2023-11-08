// 定义最大的闲置时间，例如为3分钟
import store from '@/store'
import storage from 'store'
import { Modal } from 'ant-design-vue'

const MAX_IDLE_TIME = 3600 * 1000

// 记录用户最后一次操作的时间
let lastActionTime = new Date()

// 定义一个函数，用于每次用户有行为时更新最后操作时间
function updateLastActionTime() {
  lastActionTime = new Date()
}

// 定义一个计时器
let timeoutId = setTimeout(() => {
  if (window.document.location.pathname.indexOf('/user/login') == -1) {
    Modal.confirm({
      title: '登录已过期',
      content: '登陆信息已失效，请重新登录',
      okText: '重新登录',
      mask: false,
      icon: 'exclamation-circle',
      cancelButtonProps: { style: { display: 'none' } },
      onCancel: () => {
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
      },
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
  }
  // 在这里可以添加登出等处理逻辑
}, MAX_IDLE_TIME)

// 监听页面上任何一个元素的点击事件
document.addEventListener('click', () => {
  if (window.document.location.pathname.indexOf('/user/login') == -1) {
    updateLastActionTime()
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      Modal.confirm({
        title: '登录已过期',
        content: '登陆信息已失效，请重新登录',
        okText: '重新登录',
        mask: false,
        icon: 'exclamation-circle',
        cancelButtonProps: { style: { display: 'none' } },
        onCancel: () => {
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
        },
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
      // 在这里可以添加登出等处理逻辑
    }, MAX_IDLE_TIME)
  }
})
