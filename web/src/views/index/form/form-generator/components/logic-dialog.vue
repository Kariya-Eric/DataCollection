<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="onClose"
      title="字段显隐规则"
    >
      <el-row>
        当满足以下&nbsp;&nbsp;<el-select
          size="small"
          v-model="andOr"
          style="width: 10%"
        >
          <el-option label="全部" value="and" />
          <el-option label="任意" value="or" /> </el-select
        >&nbsp;&nbsp;条件时
      </el-row>
      <div>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="addTerms"
        >
          添加条件
        </el-button>
      </div>
      <el-row v-for="(termRow, index) in termRows" :key="index">
        <el-select
          v-model="termRow.termOption"
          size="small"
          style="width: 30%"
          clearable
          @change="changeTermOption(index)"
        >
          <el-option
            v-for="(item, index) in termOptionsKV"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          size="small"
          style="width: 20%"
          v-model="termRow.equalTerm"
          :disabled="!termRow.termOption"
        >
          <el-option
            label="等于"
            :value="0"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-input' ||
                termRow.termOption.split(',')[1] === 'customMail' ||
                termRow.termOption.split(',')[1] === 'customPhone' ||
                termRow.termOption.split(',')[1] === 'customAddress' ||
                termRow.termOption.split(',')[1] === 'el-date-picker' ||
                termRow.termOption.split(',')[1] === 'customNumber')
            "
          />
          <el-option
            label="不等于"
            :value="1"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-input' ||
                termRow.termOption.split(',')[1] === 'customMail' ||
                termRow.termOption.split(',')[1] === 'customPhone' ||
                termRow.termOption.split(',')[1] === 'customAddress' ||
                termRow.termOption.split(',')[1] === 'el-date-picker' ||
                termRow.termOption.split(',')[1] === 'customNumber')
            "
          />
          <el-option
            label="等于任意一个"
            :value="2"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-select' ||
                termRow.termOption.split(',')[1] === 'el-radio-group' ||
                termRow.termOption.split(',')[1] === 'el-checkbox-group')
            "
          />
          <el-option
            label="不等于任意一个"
            :value="3"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-select' ||
                termRow.termOption.split(',')[1] === 'el-radio-group' ||
                termRow.termOption.split(',')[1] === 'el-checkbox-group')
            "
          />
          <el-option
            label="大于"
            :value="4"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-date-picker' ||
                termRow.termOption.split(',')[1] === 'customNumber')
            "
          />
          <el-option
            label="小于"
            :value="5"
            v-if="
              termRow.termOption !== '' &&
              (termRow.termOption.split(',')[1] === 'el-date-picker' ||
                termRow.termOption.split(',')[1] === 'customNumber')
            "
          />
        </el-select>
        <el-input
          clearable
          size="small"
          style="width: 49%"
          :disabled="!termRow.termOption"
          v-model="termRow.termValueInput"
          v-if="
            termRow.termOption === '' ||
            termRow.termOption.split(',')[1] === 'el-input' ||
            termRow.termOption.split(',')[1] === 'customPhone' ||
            termRow.termOption.split(',')[1] === 'customMail' ||
            termRow.termOption.split(',')[1] === 'customAddress'
          "
        />
        <el-select
          clearable
          multiple
          v-if="
            termRow.termOption !== '' &&
            (termRow.termOption.split(',')[1] === 'el-select' ||
              termRow.termOption.split(',')[1] === 'el-radio-group' ||
              termRow.termOption.split(',')[1] === 'el-checkbox-group')
          "
          size="small"
          style="width: 49%"
          v-model="termRow.termValueOption"
          :disabled="!termRow.termOption"
        >
          <el-option
            v-for="(item, index) in termRow.termValueOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>
      <el-row> 不显示以下字段 </el-row>
      <el-row>
        <el-select
          clearable
          v-model="showOption"
          multiple
          placeholder="请先添加条件"
          size="small"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in showOptions"
            :key="index"
            :label="item.__config__.label"
            :value="item.__config__.formId"
          />
        </el-select>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDrawingList } from "../utils/db";
import { componentsVisible } from "../generator/config";
export default {
  name: "LogicDialog",
  data() {
    return {
      componentsVisible,
      andOr: "and",
      termRows: [
        {
          termOption: "",
          equalTerm: "",
          termValueOption: [],
          termValueInput: "",
          termValueOptions: [],
        },
      ],
      showOption: [],
      termOptions: [],
      showOptions: [],
      updateFlag: false,
      visible: false,
      updateIndex: -1,
    };
  },
  computed: {
    termOptionsKV() {
      let data = this.termOptions.map((item) => {
        let kv = {
          label: item.__config__.label,
          value: item.__config__.formId + "," + item.__config__.tag,
        };
        return kv;
      });
      return data;
    },
  },
  methods: {
    onClose() {
      this.termRows = [
        {
          termOption: "",
          equalTerm: "",
          termValueOption: [],
          termValueInput: "",
          termValueOptions: [],
        },
      ];
      this.showOption = [];
      this.showOptions = [];
      this.visible = false;
      this.updateIndex = -1;
    },
    show(index) {
      this.visible = true;
      this.termOptions = getDrawingList().filter(
        (item) =>
          item.__config__.tag !== "customDivider" &&
          item.__config__.tag !== "customEditTable"
      );
      if (index !== undefined) {
        this.updateIndex = index;
        let data = componentsVisible[index];
        console.log("dat", data);
        this.termRows = JSON.parse(JSON.stringify(data.termList));
        this.andOr = JSON.parse(JSON.stringify(data.equalTerm));
        this.showOption = JSON.parse(JSON.stringify(data.hiddenList));
        this.updateFlag = true;
        let tempShowOptions = getDrawingList();
        for (let i = 0; i < tempShowOptions.length; i++) {
          for (let j = 0; j < this.termRows.length; j++) {
            if (this.termRows[j].termOption != "") {
              let formId = this.termRows[j].termOption.split(",")[0];
              if (tempShowOptions[i].__config__.formId == formId) {
                tempShowOptions.splice(i, 1);
              }
            }
          }
        }
        this.showOptions = tempShowOptions;
      } else {
        //新增
        this.updateFlag = false;
      }
    },

    handleSubmit() {
      let checkFlag = true;
      for (let i = 0; i < this.termRows.length; i++) {
        if (
          this.termRows[i].termOption === "" ||
          (this.termRows[i].termValueOption.length === 0 &&
            this.termRows[i].termValueInput === "") ||
          this.termRows[i].equalTerm === "" ||
          this.showOption.length === 0
        ) {
          this.$message.warning("请正确填写字段显隐规则");
          checkFlag = false;
          break;
        }
      }
      if (checkFlag) {
        let rules = {};
        rules.hiddenList = this.showOption;
        rules.termList = this.termRows;
        rules.equalTerm = this.andOr;
        if (this.updateFlag) {
          componentsVisible[this.updateIndex] = rules;
        } else {
          componentsVisible.push(rules);
        }
      }
      this.onClose();
    },

    addTerms() {
      let row = {
        termOption: "",
        equalTerm: "",
        termValueOption: [],
        termValueInput: "",
      };
      this.termRows.push(row);
    },

    changeTermOption(index) {
      this.showOption = [];
      this.termRows[index].termValueInput = "";
      this.termRows[index].equalTerm = "";
      this.termRows[index].termValueOption = [];
      this.termRows[index].termValueOptions = [];
      this.showOptions =
        this.showOptions.length === 0 ? getDrawingList() : this.showOptions;
      if (this.termRows[index].termOption !== "") {
        let tag = this.termRows[index].termOption.split(",")[1];
        let formId = this.termRows[index].termOption.split(",")[0];
        this.showOptions = this.showOptions.filter(
          (opt) => opt.__config__.formId != formId
        );
        //显示字段option的展示
        if (
          tag === "el-select" ||
          tag === "el-radio-group" ||
          tag === "el-checkbox-group"
        ) {
          //获取该三个tag的option值
          getDrawingList().forEach((ele) => {
            if (ele.__config__.formId == formId) {
              this.termRows[index].termValueOptions = ele.__slot__.options;
            }
          });
        }
      } else {
        let tempShowOptions = getDrawingList();
        for (let i = 0; i < tempShowOptions.length; i++) {
          for (let j = 0; j < this.termRows.length; j++) {
            if (this.termRows[j].termOption != "") {
              let formId = this.termRows[j].termOption.split(",")[0];
              if (tempShowOptions[i].__config__.formId == formId) {
                tempShowOptions.splice(i, 1);
              }
            }
          }
        }
        this.showOptions = tempShowOptions;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.borderDiv {
  border: 1px solid;
  height: 480px;
}
/deep/ .el-radio {
  display: block;
  margin: 10px 0;
}
/deep/ .el-checkbox {
  display: block;
  margin: 10px 0;
}
</style>
