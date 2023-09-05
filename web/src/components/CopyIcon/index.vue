<template>
  <i
    :class="`${icon} icon-cursor`"
    title="点击复制"
    @click="handleCopy($event, text)"
  />
</template>

<script>
import Clipboard from "clipboard";
export default {
  name: "CopyIcon",
  props: {
    text: {
      type: [String, Number],
      default: null,
    },
    icon: {
      type: [String],
      default: "el-icon-copy-document",
    },
    message: {
      type: String,
      default: null,
    },
  },
  methods: {
    handleCopy(e, _text, message) {
      const clipboard = new Clipboard(e.target, { text: () => _text });
      const msgText = message || `复制成功：${_text}`;
      clipboard.on("success", () => {
        this.$message({ type: "success", message: msgText });
        clipboard.off("error");
        clipboard.off("success");
        clipboard.destroy;
      });
      clipboard.on("error", () => {
        this.$message({ type: "warning", message: "复制失败，请手动复制！" });
        clipboard.off("error");
        clipboard.off("success");
        clipboard.destroy;
      });
      clipboard.onClick(e);
    },
  },
};
</script>

<style scoped lang="scss" scoped>
.icon-cursor {
  cursor: pointer;
}
</style>
