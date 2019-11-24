// Dependencies
import { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export async function handleHelp(ctx: ContextMessageUpdate) {
  await ctx.replyWithHTML(
    ctx.i18n.t('help'),
    Extra.webPreview(false) as ExtraReplyMessage
  )
}
