import { getAction, deleteAction, postAction } from '../../api'

//获取菜单树
const initMenuTree = params => getAction('/uc/api/sysMenu/getTree', params)
//根据id获取菜单详情
const getMenu = params => getAction(`/uc/api/sysMenu/get?id=${params}`)
const delMenu = params => deleteAction('/uc/api/sysMenu/remove', params)
//新增修改菜单
const saveMenu = params => postAction('/uc/api/sysMenu/save', params)
export { initMenuTree, getMenu, delMenu, saveMenu }
