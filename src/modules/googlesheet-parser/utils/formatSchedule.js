export function formatSchedule(json, day) {
  let classes = []

  for(let _class of json) {
    if(_class !== null) {
      if (_class["День недели"] === day) {
        classes.push(_class)
      }
    }
  }

  return classes
}
