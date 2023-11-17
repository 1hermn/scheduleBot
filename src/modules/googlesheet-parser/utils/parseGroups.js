export function parseGroups(json, course) {
  let groups = []
  let currentSpeciality = "-1"
  for(let key in json[0]) {
    if (currentSpeciality === "-1") {
      currentSpeciality = key
      groups.push({
        name: json[0][key],
        speciality: currentSpeciality,
        course: course
      })
    }else if(key === '' || key.startsWith("_")) {
      groups.push({
        name: json[0][key],
        speciality: currentSpeciality,
        course: course
      })
    }else {
      currentSpeciality = key
      groups.push({
        name: json[0][key],
        speciality: currentSpeciality,
        course: course
      })
    }
  }
  return groups
}
