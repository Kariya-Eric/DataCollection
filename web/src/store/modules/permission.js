import { defaultRouterMap, mainRouterMap } from '@/router/defautRouter'

function filterRouter(routerMap, roles) {
    return routerMap
}

const permission = {
    state: {
        routers: defaultRouterMap,
        addRouters: []
    },

    mutations: {
        SET_ROUTERS: (state, data) => {
            state.addRouters = data
            state.routers = defaultRouterMap.concat(data)
        }
    },

    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let routes = filterRouter(mainRouterMap, roles)
                commit('SET_ROUTERS', routes)
                resolve
            })
        }
    }
}

export default permission