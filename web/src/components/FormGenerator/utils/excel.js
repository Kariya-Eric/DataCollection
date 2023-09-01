import * as XLSX from "xlsx";

export function getSheetCell(sheet) {
    if (!sheet || !sheet['!ref']) {
        return []
    }
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let allCells = []
    for (let rowIndex = range.s.r; rowIndex <= range.e.r; ++rowIndex) {
        let newRow = []
        allCells.push(newRow)
        for (let colIndex = range.s.c; colIndex <= range.e.c; ++colIndex) {
            const cell = sheet[XLSX.utils.encode_cell({
                c: colIndex,
                r: rowIndex
            })]
            let cellContent = ""
            if (cell && cell.t) {
                cellContent = XLSX.utils.format_cell(cell)
            }
            newRow.push(cellContent)
        }
    }
    return allCells
}

export function getHtml(sheet) {
    if (!sheet || !sheet['!ref']) {
        return []
    }
    const out = [];
    const range = XLSX.utils.decode_range(sheet['!ref'])
    for (let rowIndex = range.s.r; rowIndex <= range.e.r; ++rowIndex) {
        out.push(make_html_row(sheet, range, rowIndex))
    };
    return out.join("");
}

function make_html_row(sheet, range, rowIndex) {
    let merges = (sheet['!merges'] || []);
    var oo = [];
    for (let colIndex = range.s.c; colIndex <= range.e.c; ++colIndex) {
        let rowspan = 0, colspan = 0;
        for (let j = 0; j < merges.length; ++j) {
            if (merges[j].s.r > rowIndex || merges[j].s.c > colIndex) continue;
            if (merges[j].e.r < rowIndex || merges[j].e.c < colIndex) continue;
            if (merges[j].s.r < rowIndex || merges[j].s.c < colIndex) { rowspan = -1; break; }
            rowspan = merges[j].e.r - merges[j].s.r + 1; colspan = merges[j].e.c - merges[j].s.c + 1; break;
        }
        if (rowspan < 0) continue;
        let cell = sheet[XLSX.utils.encode_cell({
            c: colIndex,
            r: rowIndex
        })]
        let cellContent = ""
        if (cell && cell.t) {
            cellContent = XLSX.utils.format_cell(cell)
        }
        let rs = rowspan > 1 ? `rowspan="${rowspan}"` : ""
        let cs = colspan > 1 ? `colspan="${colspan}"` : ""
        oo.push(`<td ${rs} ${cs}>${cellContent}</td>`)
    }
    var preamble = "<tr class='table-list'>";
    return preamble + oo.join("") + "</tr>";
}