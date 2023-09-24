import { getAction } from '../api'

const getMenuList = (params) => getAction('/uc/api/sysMenu/getUserMenu', params)
const getButtonList = (params) => getAction('/uc/api/sysMenu/getUserMethod', params)

export { getMenuList, getButtonList }
