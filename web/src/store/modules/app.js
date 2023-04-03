import Cookies from 'js-cookie';
import {
  TOGGLE_SIDEBAR,
  CLOSE_SIDEBAR,
  TOGGLE_DEVICE
} from '../mutation-types';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    language: Cookies.get('language') || 'zh',
    device: 'desktop'
  },
  mutations: {
    [TOGGLE_SIDEBAR]: (state) => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    [CLOSE_SIDEBAR]: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    [TOGGLE_DEVICE]: (state, device) => {
      state.device = device;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit(TOGGLE_SIDEBAR);
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit(CLOSE_SIDEBAR, withoutAnimation);
    },
    ToggleDevice({ commit }, device) {
      commit(TOGGLE_DEVICE, device);
    }
  }
};

export default app;
