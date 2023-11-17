import {write} from "xlsx";
import axios from "axios";

export async function xlsxToJson(file) {
  let data = write(file, {type: 'buffer', bookType: 'xlsx'})
  let form = new FormData();
  const blob = new Blob([data])
  form.append("1544507282", blob, "asdf.xlsx")
  form.append("UploadOptions", "XLSX")

  let response = await axios.post("https://api.products.aspose.app/cells/conversion/api/ConversionApi/Convert?outputType=JSON", form)

  return JSON.parse(response.data.Text)
}
