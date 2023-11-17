import mongoose from "mongoose";

export const Group = mongoose.model("Group", new mongoose.Schema({
  course: Number,
  speciality: String,
  name: String
}))

export async function addGroup(_group) {
  let group = await Group.findOne({course: _group.course, speciality: _group.speciality, name: _group.name})

  if (group === null) {
    group = new Group(_group)
    return group.save()
  }
}

export async function getGroups(options = {}) {
  return Group.find(options)
}

export async function addGroups(groups) {
  for(let group of groups) {
    await addGroup(group)
  }
}
