import RedisSMQ from "rsmq";
import {getUsers} from "../db/models/user.js";
import {Telegraf} from "telegraf";
import dotenv  from "dotenv";
dotenv.config()

//TODO
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "scheduleBotMailing"} );

const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 1_800_000
})

export function startHandling() {
  setInterval(async () => {
    console.log("Pop message")
    await popMessage()
  }, 1000)
}

export async function createMailing(msg, users, extra) {
  rsmq.createQueue({qname: "mailing"}, function (err, resp) {
    if (resp === 1) {
      console.log("queue created")
    }
  });
  extra = typeof extra !== "undefined" ? JSON.stringify(extra) : "{}"
  for (let user of users) {
    rsmq.sendMessage({qname: "mailing", message: `${user.telegramId}###${msg}###${extra}`}, (err, resp) => {
      if (!err) {
        console.log("Message sent. ID:", resp);
      }
    })
  }
}

export const popMessage = async () => {
  rsmq.popMessage({qname: "mailing"}, async (err, resp) => {
    if(!err) {
      if (resp.id) {
        let id = resp.message.split("###")[0]
        let message = resp.message.split("###")[1]
        let extra = {}
        try {
          extra = JSON.parse(resp.message.split("###")[2])
        }catch (e) {
          console.log(e)
        }
        try {
          await bot.telegram.sendMessage(id, message, {
            ...extra,
            parse_mode: "Markdown",
            disable_web_page_preview: true
          })
        } catch (e) {
          console.log("Can not send message to", id)
        }
      }
    }
  })
}

export async function sendTgMessage(id, text, extra) {
  if(typeof id !== "undefined") {
    await bot.telegram.sendMessage(id, text, {
      ...extra, parse_mode: "HTML"
    })
  }
}
