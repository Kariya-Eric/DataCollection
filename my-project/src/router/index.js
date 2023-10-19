import Vue from 'vue'
import Router from 'vue-router'
import { UserLayout, BasicLayout } from '@/layouts'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    name: 'Login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'userLogin',
        component: () => import('@/views/user/Login')
      }
    ]
  },
  {
    path: '/',
    name: 'Base',
    component: BasicLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'shujucaiji-white' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
})
