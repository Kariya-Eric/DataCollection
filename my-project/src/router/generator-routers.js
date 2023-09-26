import { RouteView } from '@/layouts'

//菜单item生成路由页面
function loadView(item) {
  let flag = item.children.length > 0
  return {
    path: item.menuUrl,
    name: item.alias,
    hidden: item.enableMenu == 0,
    component: flag ? RouteView : () => import(`@/views${item.templateUrl}`),
    meta: {
      title: item.name,
      icon: undefined,
      keepAlive: true
    },
    children: []
  }
}
//递归生成
function menuRecrusive(menus, routers) {
  menus.forEach(menu => {
    if (menu.children.length > 0) {
      const route = loadView(menu)
      routers.push(route)
      const children = menu.children
      menuRecrusive(children, route.children)
    } else {
      const route = loadPageView(menu)
      routers.push(route)
    }
  })
}

function loadPageView(item) {
  return {
    path: item.menuUrl,
    name: item.alias,
    hidden: item.enableMenu == 0,
    component: () => import(`@/views${item.templateUrl}`),
    meta: {
      title: item.name,
      icon: undefined,
      keepAlive: true
    }
  }
}

export function buildRouters(menus) {
  //多级菜单
  let subMenus = menus.filter(menu => menu.children.length > 0)
  let singleMenus = menus.filter(menu => menu.children.length == 0)
  const routers = []
  menuRecrusive(subMenus, routers)
  singleMenus.forEach(singleMenu => {
    const route = loadPageView(singleMenu)
    routers.push(route)
  })
  return routers
}
