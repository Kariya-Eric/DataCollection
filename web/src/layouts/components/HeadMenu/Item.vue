<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      vnodes.push(
        <span slot="title" class="menuName">
          {title}
        </span>
      );
    }
    return vnodes;
  },
};
</script>
<style lang="scss" scoped>
.menuName {
  margin-left: 12px;
  font-size: 16px;
  color: black;
  font-family: PingFangSC-Semibold, PingFang SC;
}
</style>
