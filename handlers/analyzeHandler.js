import moment from 'moment'
import { ethers } from "ethers";
import ExcelJS  from 'exceljs'
import roles from "../utils/roles.js";

export default async function (ctx) {
  const [address, currency] = ctx.payload.split(' ')
  if(currency !== 'eth'){
    return ctx.reply('Не верный формат сообщения.\n\nВведите /help, чтобы посмотреть формат сообщения')
  }

  if(ctx.session.queryAttempts.length >= 5){
    ctx.session.queryAttempts = ctx.session.queryAttempts.filter(time =>
      moment(time) > moment().subtract(1, 'days')
    )
    if(ctx.session.queryAttempts.length >= 5)
      return ctx.reply(`Превышено количество запросов.
Для вашей роли ${roles[ctx.session.role].name} максимальное кол-во запросов ${roles[ctx.session.role].limit}`)
  }

  ctx.session.queryAttempts.push(moment().toISOString())

  let provider = new ethers.providers.EtherscanProvider();
  let history = await provider.getHistory(address);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRows([
    ['Адрес монеты A', 'Адрес монеты B', "Дата сделки"],
    ...history.map(item => [item.from, item.to, moment(item.timestamp).format('DD.MM.YYYY HH:mm')])
  ])

  await workbook.xlsx.writeFile('history.xlsx');

  await ctx.replyWithDocument({ source: './history.xlsx', filename: 'history.xlsx' })
}
