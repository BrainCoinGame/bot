import { Telegraf, Markup } from 'telegraf'

const token = '8192560984:AAH3eXTADJAGyeBZCpUE2Ek9NpBCfq0dFAs'
const webAppUrl = 'https://braincoingame.web.app/'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'Привет! Нажми, чтоб запустить',
    Markup.inlineKeyboard([
      Markup.button.webApp(
        'Открыть мини-приложение',
        `${webAppUrl}?ref=${ctx.payload}` // Здесь в параметре ref передаем реферала в мини-приложение
      ),
    ])
  )
})

bot.launch()
