import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeCollectionList from '@/views/collection/list/locale/zh-CN';
import localeSystemUser from '@/views/system/user/locale/zh-CN';
import localeSystemMenu from '@/views/system/menu/locale/zh-CN';
import localeSystemRole from '@/views/system/role/locale/zh-CN';
import localeFormList from '@/views/form/list/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.collection': '数据采集',
  'menu.system': '系统管理',
  'menu.form': '表单管理',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeCollectionList,
  ...localeSystemUser,
  ...localeSystemMenu,
  ...localeSystemRole,
  ...localeFormList
};
