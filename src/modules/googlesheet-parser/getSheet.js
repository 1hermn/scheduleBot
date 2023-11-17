import pkg, {read} from 'xlsx';
import axios from "axios";
import {xlsxToJson} from "./utils/xlsxToJson.js";
import {parseGroups} from "./utils/parseGroups.js";

const {writeFile, readFile, utils} = pkg;

function ec(r, c){
  return utils.encode_cell({r:r,c:c});
}
function deleteRow(ws, row_index){
  let variable = utils.decode_range(ws["!ref"])
  for(let R = row_index; R < variable.e.r; ++R){
    for(let C = variable.s.c; C <= variable.e.c; ++C){
      ws[ec(R,C)] = ws[ec(R+1,C)];
    }
  }
  variable.e.r--
  ws['!ref'] = utils.encode_range(variable.s, variable.e);

  return ws
}

export async function getJSON(SHEET_ID, removeRows, course) {
  let res = await axios.get(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&id=${SHEET_ID}`, {
    responseType: "arraybuffer"
  })
  let file = read(res.data, {type: 'buffer'})

  let first = false
  const newWorksheet = utils.aoa_to_sheet([]);
  let groups = []

  for (let latestName of file.SheetNames) {
    let workSheet = file.Sheets[latestName]
    const mergedCells = workSheet['!merges'];
    if (typeof mergedCells !== "undefined") {
      for (let mergedCell of mergedCells) {
        const {s, e} = mergedCell;
        if (typeof workSheet[utils.encode_cell(s)] !== "undefined") {

          const mergedValue = workSheet[utils.encode_cell(s)].v;
          for (let row = s.r; row <= e.r; row++) {
            for (let col = s.c; col <= e.c; col++) {
              const cellAddress = utils.encode_cell({r: row, c: col});
              if (typeof workSheet[cellAddress] === "undefined") {
                workSheet[cellAddress] = {}
              }
              workSheet[cellAddress].v = mergedValue;
            }
          }
        }
      }
      workSheet['!merges'] = []
    }

    for(let i = 0; i < removeRows; i++) {
      workSheet = deleteRow(workSheet, 0)
    }

    if (!first) {
      const range = utils.decode_range(workSheet['!ref']);
      range.s.r = 0; // Начальная строка
      range.e.r = 1; // Конечная строка

      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = utils.encode_cell({r: row, c: col});
          newWorksheet[cellAddress] = workSheet[cellAddress]
        }
      }
      newWorksheet["!ref"] = 'A1:X3'
      groups = parseGroups(utils.sheet_to_json(newWorksheet), course)

      first = true
    }
    const range = utils.decode_range(workSheet['!ref']);
    range.s.r = 0; // Начальная строка
    range.e.r = 1;
    for(let col = range.s.c; col <= range.e.c; col++) {
      const cellAddressSource = utils.encode_cell({r: 0, c: col});
      const cellAddress = utils.encode_cell({r: 1, c: col});
      if (!["День недели", "Пара", "Время занятий"].includes(workSheet[cellAddressSource].v))
      workSheet[cellAddress].v = workSheet[cellAddressSource].v + "_" + workSheet[cellAddress].v
    }
    workSheet = deleteRow(workSheet, 0)

    file.Sheets[latestName] = workSheet
  }

  const json = await xlsxToJson(file)

  return {
    json, groups
  }
}
