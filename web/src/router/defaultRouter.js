import LayoutUser from '@/layouts/user'
import LayoutBase from '@/layouts/base'

export const defaultRouterMap = [
    {
        path: '/user',
        component: LayoutUser,
        redirect: '/user/login',
        hidden: true,
        children: [{
            name: 'login',
            path: 'login',
            component: () => import('@/views/user/login.vue'),
        }, {
            path: '/404',
            component: () => import('@/views/common/404.vue'),
        }]
    },
]

export const mainRouterMap = [
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