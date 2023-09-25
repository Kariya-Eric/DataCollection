// 浮动表单配置文件
import { input } from "./config_common";

export const otherComponentsFloat = [
  {
    __config__: {
      tagIcon: "表格",
      layout: "tableLayout",
      label: "表格",
      tag: "fixedTable",
      showLabel: true,
      span: 24,
      required: true,
    },
    selectedCol: -1,
    columns: [
      {
        key: 1,
        label: "列1",
        props: "col1",
        type: input,
      },
      {
        key: 2,
        label: "列2",
        props: "col2",
        type: input,
      },
      {
        key: 3,
        label: "列3",
        props: "col3",
        type: input,
      },
    ],
    comment: "",
  },
  //   {
  //     __config__: {
  //       tagIcon: "表格",
  //       layout: "tableLayout",
  //       label: "表格",
  //       tag: "floatTable",
  //       showLabel: false,
  //       span: 24,
  //       required: true,
  //     },
  //     selectedCol: -1,
  //     theader:
  //       "<table class='table'><tbody class='table-body'><tr class='table-list'><th>列1</th><th>列2</th><th>列3</th></tr></tbody></table>",
  //     mergeCells: [], //合并单元格
  //     columns: [
  //       {
  //         key: 1,
  //         props: "col1",
  //         type: input,
  //       },
  //       {
  //         key: 2,
  //         props: "col2",
  //         type: input,
  //       },
  //       {
  //         key: 3,
  //         props: "col3",
  //         type: input,
  //       },
  //     ],
  //     comment: "",
  //   },
];
