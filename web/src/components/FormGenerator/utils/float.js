// 用于根据表格和mergeCells构建浮动表单的表头

export function buildFloatHeader(tableData, mergeCells) {
  console.log("t", tableData, mergeCells);
  let headers = [];
  for (let r = 0; r < tableData.length; r++) {
    let row = [];
    let keys = Object.keys(tableData[r]);
    for (let c = 0; c < keys.length; c++) {
      if (keys[c] != "_X_ROW_KEY") {
        let rcSpan = getRowColSpan(mergeCells, r, c);
        row.push({
          title: tableData[r][keys[c]],
          rowspan: rcSpan.rowspan ? rcSpan.rowspan : null,
          colspan: rcSpan.colspan ? rcSpan.colspan : null,
        });
      }
    }
    headers.push(row);
  }
  return headers;
}

//根据mergeCells获取
function getRowColSpan(mergeCells, row, col) {
  let rcSpan = {};
  mergeCells.forEach((cell) => {
    if (cell.row == row && cell.col == col) {
      if (cell.rowspan > 1) {
        rcSpan.rowspan = cell.rowspan;
      }
      if (cell.colspan > 1) {
        rcSpan.colspan = cell.colspan;
      }
    }
  });
  return rcSpan;
}
