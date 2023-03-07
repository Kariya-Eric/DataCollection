import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FORM: AppRouteRecordRaw = {
    path: '/form',
    name: 'form',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.form',
        requiresAuth: true,
        icon: 'icon-form',
        order: 1,
    },
    children: [
        {
            path: 'list',
            name: 'FormList',
            component: () => import('@/views/form/list/index.vue'),
            meta: {
                locale: 'menu.form.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ]

};

export default FORM;
