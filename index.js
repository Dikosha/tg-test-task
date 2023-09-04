import dotenv from 'dotenv'
import {Telegraf, Scenes, session} from 'telegraf'
import { SQLite } from "@telegraf/session/sqlite";
import registrationScene from "./scenes/registration.js";
import commands from './utils/commands.js'


dotenv.config()

const store = SQLite({
  filename: "./telegraf-sessions.sqlite",
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([registrationScene])

bot.use(session({ store }));
bot.use(stage.middleware())

bot.start( (ctx) => ctx.scene.enter('registrationWizard'))

bot.command('help', ctx => {
  ctx.reply('Список команд:\n\n' + Object.keys(commands).map(key => `${commands[key].name} - ${commands[key].description}`).join('\n'))
})

bot.command(Object.keys(commands), ctx => commands[ctx.command].handler(ctx))

bot.launch()

bot.catch(err => {
  console.log('Ooops', err)
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))











