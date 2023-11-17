import mongoose from "mongoose";
import moment from "moment";
import pkg from 'lodash';
import {createMailing} from "../../rsmq/rsmq.js";
import {getUsers} from "./user.js";
const {difference, differenceWith, isEqual, omit} = pkg;



export const Schedule = mongoose.model("Schedule", new mongoose.Schema({
  week: {
    number: Number,
    start: Date,
    end: Date
  },
  course: Number,
  classes: [{
    day: String,
    classNumber: Number,
    classTime: String,
    speciality: String,
    group: String,
    name: String
  }]
}))

export async function addWeek(week) {
  let schedule = await Schedule.findOne({
    "week.start": week.week.start,
    "week.end": week.week.end,
    course: week.course
  })
  if (schedule !== null) {
    if(moment().isSameOrAfter(moment(week.end))) {
      console.log("Поиск изменений в базе...")
      let classes = schedule.classes.map(r => {
        const {_id: _, ...newObj} = JSON.parse(JSON.stringify(r));
        return newObj
      })

      let removed = differenceWith(classes, week.classes, isEqual);

      let added = differenceWith(week.classes, classes, isEqual);

      if (removed.length !== 0) {
        console.log("Обнаружено удаление пары!")
        console.log(removed)
        removed.map(async _class => {
          createMailing('Обнаружено удаление пары! ' + "```json\n" +
            JSON.stringify(_class, null, 4) + "\n```", await getUsers({course: week.course, speciality: _class.speciality, group: _class.group}))
        })
      }

      if (added.length !== 0) {
        console.log("Обнаружено добавление новой пары!")
        console.log(added)
        added.map(async _class => {
          createMailing('Обнаружено добавление новой пары! ' + "```json\n" +
            JSON.stringify(_class, null, 4) + "\n```", await getUsers({course: week.course, speciality: _class.speciality, group: _class.group}))
        })
      }
      schedule.classes = week.classes
      await schedule.save()
    }
  }else {
    schedule = new Schedule(week)
    await schedule.save()
  }
}

export async function addWeeks(weeks) {
  for(let week of weeks) {
    await addWeek(week)
  }
}


