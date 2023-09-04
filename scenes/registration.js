import {Composer, Markup, Scenes} from "telegraf";
import roles from "../utils/roles.js";

const registrationHandler = new Composer()
registrationHandler.start(async ctx => {
  if(ctx.session.chatId){
    await ctx.reply('Вы уже зарегистрированы.')
    return ctx.scene.leave();
  }

  await ctx.reply('Вас приветствует тестовый бот. Выберите роль.', Markup.inlineKeyboard(
    [
      Object.keys(roles).map(key => Markup.button.callback(roles[key].name, `chooseRole|${key}`))
    ]
  ));
  return ctx.wizard.next();
})

const chooseRoleHandler = new Composer()
chooseRoleHandler.action(/chooseRole*/, async ctx => {
  await ctx.answerCbQuery()
  const [_, role] = ctx.update.callback_query.data.split('|')
  ctx.session = {
    chatId: ctx.update.callback_query.from.id,
    role,
    queryAttempts: [],
  }
  await ctx.reply(`Вы успешно зарегистрировались.\n\nВаша роль ${roles[role].name}`)
  return ctx.wizard.next();
})

const registrationScene = new Scenes.WizardScene(
  'registrationWizard',
  registrationHandler,
  chooseRoleHandler,
)

export default registrationScene;
