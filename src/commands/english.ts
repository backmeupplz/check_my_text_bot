import { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export async function handleEnglish(ctx: ContextMessageUpdate) {
  ctx.dbuser.english = !ctx.dbuser.english
  await ctx.dbuser.save()
  await ctx.replyWithHTML(
    ctx.i18n.t(ctx.dbuser.english ? 'english_on' : 'english_off'),
    Extra.webPreview(false) as ExtraReplyMessage
  )
}
