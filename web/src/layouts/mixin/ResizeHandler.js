import { mapActions } from 'vuex';

const { body } = document;
const WIDTH = 1024;
const RATIO = 3;

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.CloseSideBar({ withoutAnimation: false });
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler);
  },
  mounted() {
    const isMobile = this.isMobile();
    if (isMobile) {
      this.ToggleDevice('mobile');
      this.CloseSideBar({ withoutAnimation: true });
    }
  },
  methods: {
    ...mapActions('app', ['ToggleDevice', 'CloseSideBar', 'ToggleSideBar']),
    isMobile() {
      const rect = body.getBoundingClientRect();
      return rect.width - RATIO < WIDTH;
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile();
        this.ToggleDevice(isMobile ? 'mobile' : 'desktop');

        if (isMobile) {
          this.CloseSideBar({ withoutAnimation: true });
        } else {
          if (!this.sidebar.opened) {
            this.ToggleSideBar();
          }
        }
      }
    }
  }
};
