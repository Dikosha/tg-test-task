import analyzeHandler from "../handlers/analyzeHandler.js";

export default {
  analyze: {
    name: '/analyze <Адрес кошелька> eth',
    description: 'Выгрузка по кошельку',
    handler: analyzeHandler
  }
}
