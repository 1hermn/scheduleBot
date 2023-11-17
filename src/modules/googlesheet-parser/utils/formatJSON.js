import {parseWeek} from "./parseWeek.js";

export function formatJSON(json, course) {
  let schedule = {
    course: course,
    weeks: []
  }
  for (let key in json) {
    let obj = {
      week: parseWeek(key),
      course: course,
      classes: []
    }
    for (let _class of json[key]) {
      if (_class !== null) {
        let __class = {}
        __class.day = _class["День недели"]
        __class.classNumber = _class["Пара"]
        __class.classTime = _class["Время занятий"]
        let keys = Object.keys(_class)
        keys = keys.filter(k => k.includes("_"))
        for (let k of keys) {
          let ___class = {... __class}
          let [speciality, group] = k.split('_')
          ___class.speciality = speciality
          ___class.group = group
          ___class.name = _class[k]

          if (Object.values(___class).filter(v => typeof v === "undefined").length === 0) {
            obj.classes.push(___class)
          }else {
            // console.log(___class)
          }
        }
      }
    }
    schedule.weeks.push(obj)
  }

  return schedule
}
