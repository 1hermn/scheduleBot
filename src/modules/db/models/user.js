import mongoose from "mongoose";

export const User = mongoose.model("User", new mongoose.Schema({
  course: Number,
  speciality: String,
  group: String,
  telegramId: String
}))

export async function getUser(telegramId) {
  return User.findOne({telegramId})
}

export async function createUser(course, speciality, group, telegramId) {
  if ((await getUser(telegramId)) === null) {
    const user = new User({
      course: course,
      speciality: speciality,
      group: group,
      telegramId: telegramId
    })
    await user.save()
  }
}

export async function getUsers(filter) {
  return User.find(filter)
}
