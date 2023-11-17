import {getJSON} from "./modules/googlesheet-parser/getSheet.js";
import {parseWeek} from "./modules/googlesheet-parser/utils/parseWeek.js";
import {formatSchedule} from "./modules/googlesheet-parser/utils/formatSchedule.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import {formatJSON} from "./modules/googlesheet-parser/utils/formatJSON.js";
import {addGroups} from "./modules/db/models/group.js";
import {addWeeks} from "./modules/db/models/sheet.js";
import {bot} from "./modules/telegram/bot.js";
import {popMessage, startHandling} from "./modules/rsmq/rsmq.js";
import {sheets} from "./config/config.js";

dotenv.config();


mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let db = mongoose.connection

db.on('error', err => {
  console.log('error', err)
})

db.once('open', () => {
  console.log('Connect to db!')
})

setInterval(async () => {
  await popMessage()
}, 1000)

async function updateSheetsAndGroups () {
  for(let sheet of sheets) {
    let {json, groups} = await getJSON(sheet.sheetId, sheet.needSpliceToIndex, sheet.course)
    let formatedJson = formatJSON(json, sheet.course)
    await addGroups(groups)
    await addWeeks(formatedJson.weeks)
  }
}

updateSheetsAndGroups()


// let currentSchedule = formatSchedule(json[current.key], current.day)
// console.log(currentSchedule)
// console.log(groups)

await bot.launch()
// startHandling()
