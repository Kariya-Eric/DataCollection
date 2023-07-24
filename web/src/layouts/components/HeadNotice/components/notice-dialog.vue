<template>
  <div>
    <el-dialog :visible="visible" :append-to-body="false" @close="onClose">
      <div slot="title" class="title">消息通知</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <notice-list
            v-for="notice in notices"
            :key="notice.id"
            :notice="notice"
            @close="onClose"
          />
        </el-tab-pane>
        <el-tab-pane label="已读" name="second"
          ><notice-list
            v-for="notice in notices"
            :key="notice.id"
            :notice="notice"
            @close="onClose"
        /></el-tab-pane>
        <el-tab-pane :label="`未读(${number})`" name="third"
          ><notice-list
            v-for="notice in notices"
            :key="notice.id"
            :notice="notice"
            @close="onClose"
        /></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { list } from "@/api/notice";
import NoticeList from "./notice-list.vue";
export default {
  components: { NoticeList },
  props: ["number"],
  data() {
    return {
      visible: false,
      notices: [],
      activeName: "third",
    };
  },

  methods: {
    onClose() {
      this.visible = false;
    },
    show() {
      this.activeName = "third";
      this.showList(0);
      this.visible = true;
    },

    showList(type) {
      let param = {
        pageBean: {
          page: 1,
          pageSize: 20,
          showTotal: true,
        },
        params: { readStatus: type },
      };
      list(param).then((res) => {
        if (res.state) {
          this.notices = res.value.rows;
        }
      });
    },

    handleClick(tab, event) {
      if (this.activeName == "first") {
        this.showList();
      } else if (this.activeName == "second") {
        this.showList(1);
      } else {
        this.showList(0);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  color: black;
}

::v-deep .el-dialog__body {
  padding-top: 8px;
}
::v-deep .el-dialog__header {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 0ch;
  padding-bottom: 12px;
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
