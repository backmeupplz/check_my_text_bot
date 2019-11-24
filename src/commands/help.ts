// Dependencies
import Telegraf, { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export function setupHelp(bot: Telegraf<ContextMessageUpdate>) {
  bot.command(['help', 'start'], ctx => {
    ctx.replyWithHTML(
      ctx.i18n.t('help'),
      Extra.webPreview(false) as ExtraReplyMessage
    )
  })
}
