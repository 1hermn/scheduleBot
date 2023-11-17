import {Markup, Scenes} from "telegraf"
import {getGroups} from "../../db/models/group.js";
import {createUser} from "../../db/models/user.js";

export const Register = new Scenes.WizardScene(
  'register',
  async ctx => {
    await ctx.reply("Выберите ваш курс", Markup.inlineKeyboard([
      Markup.button.callback("1", "1"),
      Markup.button.callback("2", "2"),
      Markup.button.callback("3", "3"),
      Markup.button.callback("4", "4")
    ]))
    return ctx.wizard.next()
  },
  async ctx => {
    if (typeof ctx.callbackQuery !== "undefined") {
      ctx.session.course = ctx.callbackQuery?.data
      let groups = await getGroups({course: ctx.callbackQuery?.data})
      let specialities = {}

      for(let group of groups) {
        if (typeof specialities[(await group).speciality] === "undefined") {
          specialities[(await group).speciality] = group._id
        }
      }

      await ctx.editMessageText("Выберите вашу специальность",
        Markup.inlineKeyboard(Object.keys(specialities).map(s => [Markup.button.callback(s, specialities[s])])))
      return ctx.wizard.next()
    }
  },
  async ctx => {
    if (typeof ctx.callbackQuery !== "undefined") {
      ctx.session.speciality = (await getGroups({_id: ctx.callbackQuery?.data}))[0].speciality
      let groups = await getGroups({speciality: ctx.session.speciality})

      await ctx.editMessageText("Выберите вашу кафедру/группу",
        Markup.inlineKeyboard(groups.map(g => [Markup.button.callback(g.name, g._id)])))

      return ctx.wizard.next()
    }
  },
  async ctx => {
    if (typeof ctx.callbackQuery !== "undefined") {
      let group = (await getGroups({_id: ctx.callbackQuery?.data}))[0].name
      await createUser(ctx.session.course, ctx.session.speciality, group, ctx.from.id)
      ctx.reply("Пользователь создан. Вы будете получать уведомления об изменениях в расписании")
      await ctx.scene.leave()
    }
  }
)
