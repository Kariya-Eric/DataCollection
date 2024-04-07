import { PageView, RepositoryView } from '@/layouts'
import { BlankLayout } from '@/layouts/index'
import { constantRouterMap } from '@/router'

//菜单item生成路由页面
function loadView(item) {
  let flag = item.children.length > 0
  let repositoryFlag = item.menuUrl === '/repository'
  return {
    path: item.menuUrl,
    name: item.alias,
    hidden: item.enableMenu == 0,
    component: flag ? (repositoryFlag ? RepositoryView : PageView) : () => import(`@/views${item.templateUrl}`),
    redirect: item.load,
    meta: {
      title: item.name,
      icon: item.menuIcon ? item.menuIcon : undefined,
      keepAlive: true
    },
    children: []
  }
}

function loadFullscreenView(item) {
  return {
    path: '/',
    name: item.alias,
    hidden: item.enableMenu == 0,
    component: BlankLayout,
    children: [
      {
        path: item.menuUrl,
        name: item.alias,
        meta: {
          title: item.name,
          icon: item.menuIcon ? item.menuIcon : undefined,
          keepAlive: true
        },
        component: () => import(`@/views${item.templateUrl}`)
      }
    ]
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
      if (menu.menuUrl === '/task/add' || menu.menuUrl === '/form/design') {
        const route = loadFullscreenView(menu)
        constantRouterMap.push(route)
      } else {
        const route = loadPageView(menu)
        routers.push(route)
      }
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
      icon: item.menuIcon ? item.menuIcon : undefined,
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
