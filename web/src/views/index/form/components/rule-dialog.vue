<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="close"
    width="45%"
    :append-to-body="true"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-form-item label="校验名称">
        <el-input v-model="ruleForm.name" placeholder="请输入检验名称" />
      </el-form-item>
      <el-form-item label="校验模式">
        <el-radio-group v-model="ruleForm.mode">
          <el-radio :label="1">表内校验</el-radio>
          <el-radio :label="2">表间校验</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="校验类型">
        <el-radio-group v-model="ruleForm.type">
          <el-radio
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="校验失败提示">
        <el-input
          type="textarea"
          v-model="ruleForm.msg"
          placeholder="请输入校验失败提示"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="ruleForm.enabled"></el-switch>
      </el-form-item>
      <div v-if="ruleForm.type === 1" class="typeDiv">
        <div style="margin-left: 18px; margin-bottom: 12px">
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addDataRangeAnd"
          >
            且条件
          </el-button>
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addDataRangeOr"
          >
            或条件
          </el-button>
        </div>
        <div v-for="(item, index) in ruleForm.data_range" :key="index">
          <div class="innerForm">
            <div
              style="text-align: right; font-size: 18px"
              v-if="ruleForm.data_range.length != 1"
            >
              <i
                class="el-icon-circle-close"
                @click="delDataRangeAndOr(index)"
              />
            </div>
            <el-form-item label="公式左侧">
              <el-row>
                <el-col :span="8">
                  <el-select placeholder="请选择" v-model="item.left_field">
                    <el-option label="表单字段" :value="0" />
                    <el-option label="固定值" :value="1" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-if="item.left_field == 0"
                    v-model="item.left_value"
                    placeholder="请选择表单字段"
                  >
                    <el-option label="数据范围1" value="数据范围1" />
                    <el-option label="数据范围2" value="数据范围2" />
                  </el-select>
                  <el-input
                    v-else
                    v-model="item.left_value"
                    placeholder="请输入"
                  />
                </el-col>
                <el-col :span="8">
                  <el-button
                    style="margin-left: 12px"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    size="small"
                    @click="addCaculte(index)"
                  >
                    添加计算
                  </el-button>
                </el-col>
              </el-row>
              <div
                v-for="(c, i) in item.caculateList"
                :key="i"
                style="margin-top: 8px"
              >
                <el-row>
                  <el-col :span="6">
                    <el-select
                      v-model="c.calFlag"
                      placeholder="请选择四则运算符"
                      style="margin-right: 8px"
                    >
                      <el-option label="+" value="+" />
                      <el-option label="-" value="-" />
                      <el-option label="*" value="*" />
                      <el-option label="/" value="/" />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select placeholder="请选择" v-model="c.calField">
                      <el-option label="表单字段" :value="0" />
                      <el-option label="固定值" :value="1" />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select
                      v-if="c.calField == 0"
                      v-model="c.calValue"
                      placeholder="请选择表单字段"
                    >
                      <el-option label="数据范围1" value="数据范围1" />
                      <el-option label="数据范围2" value="数据范围2" />
                    </el-select>
                    <el-input
                      v-else
                      v-model="c.calValue"
                      placeholder="请输入"
                    />
                  </el-col>
                  <el-col :span="2">
                    <div
                      class="close-btn select-line-icon"
                      style="margin-left: 12px"
                    >
                      <i
                        class="el-icon-remove-outline"
                        @click="delCaculate(index, i)"
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="判断符">
              <el-select placeholder="请选择" v-model="item.symbol">
                <el-option label="<" :value="0" />
                <el-option label="<=" :value="1" />
                <el-option label="=" :value="2" />
                <el-option label=">=" :value="3" />
                <el-option label=">=" :value="4" />
                <el-option label="!=" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="公式右侧">
              <el-row>
                <el-col :span="8">
                  <el-select placeholder="请选择" v-model="item.right_field">
                    <el-option label="表单字段" :value="0" />
                    <el-option label="固定值" :value="1" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select
                    v-if="item.right_field == 0"
                    v-model="item.right_value"
                    placeholder="请选择表单字段"
                  >
                    <el-option label="数据范围1" value="数据范围1" />
                    <el-option label="数据范围2" value="数据范围2" />
                  </el-select>
                  <el-input
                    v-else
                    v-model="item.right_value"
                    placeholder="请输入"
                /></el-col>
              </el-row>
            </el-form-item>
          </div>
          <div v-if="item.and_or != undefined" style="margin-left: 16px">
            {{ item.and_or == "and" ? "并且" : "或者" }}
          </div>
        </div>
      </div>
      <div v-if="ruleForm.type === 2" class="typeDiv">
        <div style="margin-left: 18px">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addUnique"
          >
            添加唯一性组合
          </el-button>
        </div>
        <el-form-item label="唯一性组合">
          <div
            v-for="(item, index) in ruleForm.unique"
            :key="index"
            class="formItem"
          >
            <el-select
              v-model="ruleForm.unique[index]"
              placeholder="请选择表单字段"
            >
              <el-option :label="1" :value="1" />
              <el-option :label="2" :value="2" />
              <el-option :label="3" :value="3" />
            </el-select>
            <div
              class="close-btn select-line-icon"
              v-if="ruleForm.unique.length > 1"
            >
              <i class="el-icon-remove-outline" @click="delUnique(index)" />
            </div>
          </div>
        </el-form-item>
      </div>
      <div v-if="ruleForm.type === 3" class="typeDiv">
        <div style="margin-left: 18px; margin-bottom: 12px">
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addDateAnd"
          >
            且条件
          </el-button>
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addDateOr"
          >
            或条件
          </el-button>
        </div>
        <div v-for="(item, index) in ruleForm.date" :key="index">
          <div class="innerForm">
            <div
              style="text-align: right; font-size: 18px"
              v-if="ruleForm.date.length != 1"
            >
              <i class="el-icon-circle-close" @click="delDateAndOr(index)" />
            </div>
            <el-form-item label="公式左侧">
              <el-select placeholder="请选择" v-model="item.left_field">
                <el-option label="表单字段" :value="0" />
                <el-option label="固定值" :value="1" />
              </el-select>
              <el-date-picker
                v-model="item.left_value"
                style="margin-left: 12px"
                placeholder="请选择日期"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
              />
            </el-form-item>
            <el-form-item label="判断符">
              <el-select placeholder="请选择" v-model="item.symbol">
                <el-option label="<" :value="0" />
                <el-option label="<=" :value="1" />
                <el-option label="=" :value="2" />
                <el-option label=">=" :value="3" />
                <el-option label=">=" :value="4" />
                <el-option label="!=" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="公式右侧">
              <el-select placeholder="请选择" v-model="item.right_field">
                <el-option label="表单字段" :value="0" />
                <el-option label="固定值" :value="1" />
              </el-select>
              <el-date-picker
                v-model="item.right_value"
                style="margin-left: 12px"
                placeholder="请选择日期"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
              />
            </el-form-item>
          </div>
          <div v-if="item.and_or != undefined" style="margin-left: 16px">
            {{ item.and_or == "and" ? "并且" : "或者" }}
          </div>
        </div>
      </div>
      <div v-if="ruleForm.type === 4">
        <el-form-item label-width="0">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入自定义脚本"
            v-model="ruleForm.script"
          />
        </el-form-item>
      </div>
      <div v-if="ruleForm.type === 5" class="typeDiv">
        <div style="margin-left: 18px">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addReject"
          >
            添加排他性校验
          </el-button>
        </div>
        <el-form-item label="当前表字段">
          <div
            v-for="(item, index) in ruleForm.reject"
            :key="index"
            class="formItem"
          >
            <el-select
              v-model="ruleForm.reject[index]"
              placeholder="请选择当前表字段"
            >
              <el-option label="排他性校验1" value="排他性校验1" />
              <el-option label="排他性校验2" value="排他性校验2" />
            </el-select>
            <div
              class="close-btn select-line-icon"
              v-if="ruleForm.reject.length > 1"
            >
              <i class="el-icon-remove-outline" @click="delReject(index)" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="与关联表">
          <el-select
            placeholder="请选择关联表"
            v-model="ruleForm.reject_table"
          ></el-select>
          <el-select
            placeholder="请选择关联表字段"
            style="margin-left: 12px"
            v-model="ruleForm.reject_table_field"
          ></el-select>
        </el-form-item>
      </div>
      <div v-if="ruleForm.type === 6" class="typeDiv">
        <div style="margin-left: 18px; margin-bottom: 12px">
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addSimilarAnd"
          >
            且条件
          </el-button>
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            size="small"
            @click="addSimilarOr"
          >
            或条件
          </el-button>
        </div>
        <div v-for="(item, index) in ruleForm.similar" :key="index">
          <div class="innerForm">
            <div
              style="text-align: right; font-size: 18px"
              v-if="ruleForm.similar.length != 1"
            >
              <i class="el-icon-circle-close" @click="delSimilarAndOr(index)" />
            </div>
            <div style="margin-left: 18px; margin-top: -8px">
              <el-button
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSimilarField(index)"
              >
                添加表字段
              </el-button>
              <el-button
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSimilarRelate(index)"
              >
                添加关联表
              </el-button>
            </div>
            <el-form-item label="当前表字段">
              <div v-for="(c, i) in item.current" :key="i" class="formItem">
                <el-select v-model="c.field" placeholder="请选择当前表字段">
                  <el-option label="一致性校验1" value="一致性校验1" />
                  <el-option label="一致性校验2" value="一致性校验2" />
                </el-select>
                <div
                  class="close-btn select-line-icon"
                  v-if="item.current.length > 1"
                >
                  <i
                    class="el-icon-remove-outline"
                    @click="delSimilarField(index, i)"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="与关联表">
              <div v-for="(r, i) in item.relate" :key="i" class="formItem">
                <el-select v-model="r.table" placeholder="请选择关联表">
                  <el-option label="一致性校验1" value="一致性校验1" />
                  <el-option label="一致性校验2" value="一致性校验2" />
                </el-select>
                <el-select
                  v-model="r.field"
                  placeholder="请选择关联表字段"
                  style="margin-left: 12px"
                >
                  <el-option label="一致性校验1" value="一致性校验1" />
                  <el-option label="一致性校验2" value="一致性校验2" />
                </el-select>
                <div
                  class="close-btn select-line-icon"
                  v-if="item.relate.length > 1"
                >
                  <i
                    class="el-icon-remove-outline"
                    @click="delSimilarRelate(index, i)"
                  />
                </div>
                <span
                  v-if="i == item.relate.length - 1"
                  style="margin-left: 16px"
                  >一致</span
                >
              </div>
            </el-form-item>
          </div>
          <div v-if="item.and_or != undefined" style="margin-left: 16px">
            {{ item.and_or == "and" ? "并且" : "或者" }}
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RuleDialog",
  data() {
    return {
      visible: false,
      updateFlag: false,
      ruleForm: {},
      rules: {},
      typeList: [
        { name: "数据范围校验", value: 1 },
        { name: "唯一性校验", value: 2 },
        { name: "时间日期校验", value: 3 },
        { name: "自定义校验", value: 4 },
      ],
    };
  },
  computed: {
    title() {
      let mode = "";
      if (this.ruleForm.mode === 1) {
        mode = "（表内校验）";
      } else if (this.ruleForm.mode === 2) {
        mode = "（表间校验）";
      }
      return this.updateFlag ? `修改校验${mode}` : `添加校验${mode}`;
    },
  },
  watch: {
    "ruleForm.mode"(newVal) {
      this.$set(this.ruleForm, "type", null);
      if (newVal == 1) {
        this.typeList = [
          { name: "数据范围校验", value: 1 },
          { name: "唯一性校验", value: 2 },
          { name: "时间日期校验", value: 3 },
          { name: "自定义校验", value: 4 },
        ];
      } else {
        this.typeList = [
          { name: "数据范围校验", value: 1 },
          { name: "排他性校验", value: 5 },
          { name: "一致性校验", value: 6 },
          { name: "自定义校验", value: 4 },
        ];
      }
    },
    "ruleForm.type"(newVal) {
      if (newVal == 5) {
        this.$set(this.ruleForm, "reject", [undefined]);
      }
      if (newVal == 2) {
        this.$set(this.ruleForm, "unique", [undefined]);
      }
      if (newVal == 3) {
        this.$set(this.ruleForm, "date", [
          {
            left_field: undefined,
            left_value: undefined,
            symbol: undefined,
            right_field: undefined,
            right_value: undefined,
            and_or: undefined,
          },
        ]);
      }
      if (newVal == 6) {
        this.$set(this.ruleForm, "similar", [
          {
            current: [{ field: undefined }],
            relate: [{ table: undefined, field: undefined }],
            and_or: undefined,
          },
        ]);
      }
      if (newVal == 1) {
        this.$set(this.ruleForm, "data_range", [
          {
            left_field: undefined,
            left_value: undefined,
            symbol: undefined,
            right_field: undefined,
            right_value: undefined,
            and_or: undefined,
            caculateList: [],
          },
        ]);
      }
    },
  },
  methods: {
    show(info) {
      if (info) {
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.ruleForm = {};
      this.$refs.ruleForm.resetFields();
    },

    addSimilarField(index) {
      this.ruleForm.similar[index].current.push({ field: undefined });
    },

    delSimilarField(index, i) {
      this.ruleForm.similar[index].current.splice(i, 1);
    },

    addSimilarRelate(index) {
      this.ruleForm.similar[index].relate.push({
        table: undefined,
        field: undefined,
      });
    },

    delSimilarRelate(index, i) {
      this.ruleForm.similar[index].relate.splice(i, 1);
    },

    addSimilarAnd() {
      let index = this.ruleForm.similar.length - 1;
      this.ruleForm.similar[index].and_or = "and";
      this.ruleForm.similar.push({
        current: [{ field: undefined }],
        relate: [{ table: undefined, field: undefined }],
        and_or: undefined,
      });
    },

    addSimilarOr() {
      let index = this.ruleForm.similar.length - 1;
      this.ruleForm.similar[index].and_or = "or";
      this.ruleForm.similar.push({
        current: [{ field: undefined }],
        relate: [{ table: undefined, field: undefined }],
        and_or: undefined,
      });
    },

    delSimilarAndOr(index) {
      this.ruleForm.similar.splice(index, 1);
      this.ruleForm.similar[this.ruleForm.similar.length - 1].and_or =
        undefined;
    },

    addDataRangeAnd() {
      let index = this.ruleForm.data_range.length - 1;
      this.ruleForm.data_range[index].and_or = "and";
      this.ruleForm.data_range.push({
        left_field: undefined,
        left_value: undefined,
        symbol: undefined,
        right_field: undefined,
        right_value: undefined,
        and_or: undefined,
        caculateList: [],
      });
    },

    addDataRangeOr() {
      let index = this.ruleForm.data_range.length - 1;
      this.ruleForm.data_range[index].and_or = "or";
      this.ruleForm.data_range.push({
        left_field: undefined,
        left_value: undefined,
        symbol: undefined,
        right_field: undefined,
        right_value: undefined,
        and_or: undefined,
        caculateList: [],
      });
    },

    delDataRangeAndOr(index) {
      this.ruleForm.data_range.splice(index, 1);
      this.ruleForm.data_range[this.ruleForm.data_range.length - 1].and_or =
        undefined;
    },

    addCaculte(index) {
      this.ruleForm.data_range[index].caculateList.push({
        calFlag: undefined,
        calField: undefined,
        calValue: undefined,
      });
    },

    delCaculate(index, i) {
      this.ruleForm.data_range[index].caculateList.splice(i, 1);
    },

    addDateAnd() {
      let index = this.ruleForm.date.length - 1;
      this.ruleForm.date[index].and_or = "and";
      this.ruleForm.date.push({
        left_field: undefined,
        left_value: undefined,
        symbol: undefined,
        right_field: undefined,
        right_value: undefined,
        and_or: undefined,
      });
    },

    addDateOr() {
      let index = this.ruleForm.date.length - 1;
      this.ruleForm.date[index].and_or = "or";
      this.ruleForm.date.push({
        left_field: undefined,
        left_value: undefined,
        symbol: undefined,
        right_field: undefined,
        right_value: undefined,
        and_or: undefined,
      });
    },

    delDateAndOr(index) {
      this.ruleForm.date.splice(index, 1);
      this.ruleForm.date[this.ruleForm.date.length - 1].and_or = undefined;
    },

    addReject() {
      this.ruleForm.reject.push(undefined);
    },

    delReject(index) {
      this.ruleForm.reject.splice(index, 1);
    },

    addUnique() {
      this.ruleForm.unique.push(undefined);
    },

    delUnique(index) {
      this.ruleForm.unique.splice(index, 1);
    },

    handleSubmit() {
      console.log(this.ruleForm);
      this.$message.warning("等待后端接口");
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.typeDiv {
  background-color: #f5f8fd;
  min-height: 200px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  padding-top: 12px;
  padding-bottom: 24px;
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  .innerForm {
    margin: 12px;
    padding: 12px 12px 0px 12px;
    border: 1px dashed #abcaf9;
    border-radius: 5px;
    /deep/.el-form-item {
      margin-bottom: 12px;
    }
  }
  .formItem {
    display: flex;
    margin-bottom: 12px;
    & .close-btn {
      font-size: 20px;
      margin-left: 12px;
      cursor: pointer;
      color: #f56c6c;
    }
    & .add-btn {
      font-size: 20px;
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
</style>