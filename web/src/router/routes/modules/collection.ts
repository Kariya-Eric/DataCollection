import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const COLLECTION: AppRouteRecordRaw = {
    path: '/collection',
    name: 'collection',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.collection',
        requiresAuth: true,
        icon: 'icon-folder',
        order: 1,
    },
    children: [
        {
            path: 'list',
            name: 'CollectionList',
            component: () => import('@/views/collection/list/index.vue'),
            meta: {
                locale: 'menu.collection.list',
                requiresAuth: true,
                icon: 'icon-file',
                roles: ['*'],
            },
        },
    ]

};

export default COLLECTION;
