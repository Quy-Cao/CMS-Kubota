import exceljs from 'exceljs';
import fileSaver from 'file-saver';

const getDataLength = (value) => {
  if (typeof value == 'string') {
    let lineBreakPos = value.indexOf('\n')
    if(lineBreakPos > 0)
      return lineBreakPos + 1;
    else
      return value.length;
  }
  return 0; 
};

export default async function exportExcel (data, fileName, sheetName) {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  const columns = [];
  for(let column in data[0]) {
    let dataLength = getDataLength(data[0][column]);
    let columnWidth = dataLength > column.length ? dataLength + 2: column.length + 2;
    columns.push({
      header: column,
      key: column,
      width: columnWidth,
      style: {
        alignment: {
          wrapText: true,
          horizontal: 'left',
          vertical: 'top'
        }
      }
    })
  }
  sheet.columns = columns;
  sheet.addRows(data);
  sheet.getRow(1).font = { bold: true };
  let buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }); 
  fileSaver.saveAs(blob, fileName);
}
