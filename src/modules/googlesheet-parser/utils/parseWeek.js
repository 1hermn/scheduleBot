import moment from "moment";

const regexDate = /(\d{2}\.\d{2})\D+(\d{2}\.\d{2})/;
const regexWeek = /(\d+)\D+неделя/;

function getWeekDay(date) {
  let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return days[date.getDay()];
}

export function parseWeek(key) {
  let week = {}
  const weekNumberMatch = key.match(regexWeek);
  if (weekNumberMatch) {
    week["number"] = Number(weekNumberMatch[1])
  }

  const startDateMatch = key.match(regexDate);
  if (startDateMatch) {
    const startDate = startDateMatch[1];
    const endDate = startDateMatch[2];
    week["start"] = moment(startDate, "DD.MM").toDate()
    week["end"] = moment(endDate, "DD.MM").toDate()
  }
  return week
}
