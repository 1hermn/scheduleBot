import {Scenes, session, Telegraf} from "telegraf";
import {getUser} from "../db/models/user.js";
import {Register} from "./stages/register.js";
import dotenv from "dotenv"
dotenv.config()
export const bot = new Telegraf(process.env.BOT_TOKEN)

const stage = new Scenes.Stage([
  Register
])

bot.use(session());

bot.use(stage.middleware());

bot.start(async ctx => {
  const user = await getUser(ctx.from.id)
  if (user === null) {
    await ctx.scene.enter("register")
  }
})
