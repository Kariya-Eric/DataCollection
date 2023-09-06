<template>
  <el-dialog
    :title="updateFlag ? '添加显隐规则' : '修改显隐规则'"
    :visible="visible"
    v-if="visible"
    append-to-body
    @close="close"
  >
    <el-form ref="logicForm" size="small" :model="logicForm" :rules="rules">
      <el-form-item prop="andOr">
        当满足以下<el-select v-model="logicForm.andOr" class="andOr">
          <el-option label="全部" value="&&" />
          <el-option label="任意" value="||" /> </el-select
        >条件时
      </el-form-item>
      <el-button
        style="margin-bottom: 8px"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addTerm"
      >
        添加条件
      </el-button>
      <el-form-item
        v-for="(item, index) in logicForm.termList"
        :key="index"
        :prop="'termList.' + index"
        :rules="rules.termList"
      >
        <div class="termRow">
          <logic-item
            :drawing-list="drawingList"
            v-model="logicForm.termList[index]"
          />
          <i
            v-if="logicForm.termList.length > 1"
            class="el-icon-delete"
            @click="delTerm(index)"
          ></i>
        </div>
      </el-form-item>
      <el-form-item label="显示以下字段" prop="showList">
        <el-select v-model="logicForm.showList" style="width: 100%" multiple>
          <el-option
            v-for="(item, index) in showOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <mbutton name="取消" @click="close" />
      <mbutton type="primary" name="确定" @click="handleSubmit" />
    </div>
  </el-dialog>
</template>

<script>
import LogicItem from "./logic-item";

export default {
  name: "LogicDialog",
  props: ["drawingList", "formConf"],
  components: { LogicItem },
  computed: {
    showOptions() {
      return this.drawingList.map((item) => {
        let value = item.__config__.formId;
        if (item.__config__.tag == '"formDivider"') {
          return { label: item.title, value };
        }
        return { label: item.__config__.label, value };
      });
    },
  },
  data() {
    return {
      visible: false,
      updateFlag: false,
      index: 0,
      logicForm: {
        andOr: "",
        termList: [{ term: "", calFlag: "", termVal: "" }],
        showList: [],
      },
      rules: {
        andOr: [{ required: true, message: "请选择条件" }],
        showList: [{ required: true, message: "请至少选择一条" }],
        termList: [
          {
            validator: (rule, value, callback) => {
              if (value.term == "" || value.calFlag == "") {
                callback(new Error("请正确构建条件！"));
              }
              if (value.termVal instanceof Array && value.termVal.length == 0) {
                callback(new Error("请正确构建条件！"));
              } else if (value.termVal === "") {
                callback(new Error("请正确构建条件！"));
              }
              callback();
            },
          },
        ],
      },
    };
  },
  methods: {
    show(index) {
      if (index != undefined) {
        this.logicForm = JSON.parse(
          JSON.stringify(this.formConf.componentsVisible[index])
        );
        this.index = index;
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.logicForm.resetFields();
      this.logicForm = {
        andOr: "",
        termList: [{ term: "", calFlag: "", termVal: "" }],
        showList: [],
      };
    },

    handleSubmit() {
      for (let i = 0; i < this.logicForm.showList.length; i++) {
        let show = this.logicForm.showList[i];
        if (this.logicForm.termList.map((term) => term.term).includes(show)) {
          this.$message.warning("条件字段中请不要包含显示字段！");
          return;
        }
      }
      this.$refs.logicForm.validate((valid) => {
        if (valid) {
          let logic = JSON.parse(JSON.stringify(this.logicForm));
          if (this.updateFlag) {
            this.formConf.componentsVisible[this.index] = logic;
          } else {
            this.formConf.componentsVisible.push(logic);
          }
          this.close();
        }
      });
    },

    delTerm(index) {
      this.logicForm.termList = this.logicForm.termList.filter(
        (item, i) => i != index
      );
    },

    addTerm() {
      this.logicForm.termList.push({ term: "", calFlag: "", termVal: "" });
    },
  },
};
</script>

<style lang="scss" scoped>
.andOr {
  margin-left: 12px;
  margin-right: 12px;
}
.termRow {
  i {
    cursor: pointer;
    float: right;
    margin: -24px 4px;
  }
}
</style>
