import Vue from 'vue'
import Router from 'vue-router'
import { UserLayout, BasicLayout, RouteView } from '@/layouts'

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
        meta: { title: '首页' }
      },
      {
        path: '/form',
        name: 'form',
        component: RouteView,
        meta: { title: '表格' },
        children: [
          {
            path: '/form/list',
            name: 'formList',
            component: () => import('@/views/form/list'),
            meta: { title: 'formlIst' }
          }
        ]
      }
    ]
  },
  {
    path: '/test',
    component: () => import('@/views/test/index'),
    name: 'test'
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    name: 'error',
    children: [
      {
        path: '/404',
        component: () => import('@/views/exception/404'),
        name: '404',
        meta: { title: 404 }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    mode: 'history',
    routes: constantRouterMap,
    scrollBehavior: () => ({
      y: 0
    })
  })

const router = createRouter()

export default router
