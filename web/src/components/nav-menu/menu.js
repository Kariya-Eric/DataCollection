import { Menu, Icon } from "ant-design-vue";

const { Item, SubMenu } = Menu;

export default {
  name: "side-menu",
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
    };
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {
    renderItem(menu) {
      if (menu.enableMenu == 1) {
        return null;
      }
      return menu.children
        ? this.renderSubMenu(menu)
        : this.renderMenuItem(menu);
    },

    renderMenuItem(menu) {
        let props = { to: { name: menu.name } }
      return (
        <Item>
          <span>{menu.name}</span>
        </Item>
      );
    },

    renderSubMenu(menu) {
      return (
        <SubMenu>
          <span>{menu.name}</span>
        </SubMenu>
      );
    },

    onSelect({ item, key, selectedKeys }) {
      this.selectedKeys = selectedKeys;
      this.$emit("select", { item, key, selectedKeys });
    },
  },

  render() {
    const newProps = {
      props: {
        openKeys: this.openKeys,
        selectedKeys: this.selectedKeys,
      },
      on: {
        select: this.onSelect,
      },
    };

    const menuTree = this.menus.map((item) => {
      if (item.enableMenu == 1) {
        return null;
      }
      return this.renderItem(item);
    });

    return <Menu {...newProps}>{menuTree}</Menu>;
  },
};
