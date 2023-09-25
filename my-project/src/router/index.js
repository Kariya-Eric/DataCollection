import Vue from 'vue'
import Router from 'vue-router'
import { UserLayout } from '@/layouts'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
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
        name: 'Login',
        component: () => import('@/views/user/Login'),
      },
    ],
  },
  {
    path: '/test',
    component: () => import('@/views/test/index'),
    name: 'test',
  },
]

const createRouter = () =>
  new Router({
    mode: 'history',
    routes: constantRouterMap,
    scrollBehavior: () => ({
      y: 0,
    }),
  })

const router = createRouter()

export default router
