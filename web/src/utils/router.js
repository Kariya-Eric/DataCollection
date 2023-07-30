import BasicLayout from "@/layouts/BasicLayout";

//菜单item生成路由页面
function loadView(item) {
  let flag = item.alias == "home" ? true : item.children.length > 0;
  return {
    path: item.menuUrl,
    name: item.alias,
    hidden: item.enableMenu == 0,
    component: flag
      ? BasicLayout
      : () => import(`@/views/index${item.templateUrl}`),
    meta: {
      title: item.name,
    },
    children: [],
  };
}
//递归生成
function menuRecrusive(menus, routers) {
  menus.forEach((menu) => {
    const route = loadView(menu);
    routers.push(route);
    const children = menu.children;
    if (children.length > 0) {
      menuRecrusive(children, route.children);
    }
  });
}

export function buildRouters(menus) {
  const routers = [];
  menuRecrusive(menus, routers);
  return routers;
}
