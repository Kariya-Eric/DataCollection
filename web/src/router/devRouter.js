
import LayoutBase from '@/layouts/base'
import LayoutBlock from '@/layouts/block'

export const constantRouterMap = [
  {
    path: '/',
    component: LayoutBase,
    redirect: '/dashboard/workplace',
    children: [{
      path: 'dashboard',
      component: LayoutBlock,
      meta: {
        title: '首页',
        icon: 'dashboard'
      },
      children: [{
        path: 'workplace',
        component: () => import('@/views/dashboard/workplace.vue'),
        meta: {
          title: '工作台'
        }
      }]
    }]
  }
]