import { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export async function handleGlvrd(ctx: ContextMessageUpdate) {
  ctx.dbuser.glvrd = !ctx.dbuser.glvrd
  await ctx.dbuser.save()
  await ctx.replyWithHTML(
    ctx.i18n.t(ctx.dbuser.glvrd ? 'glvrd_on' : 'glvrd_off'),
    Extra.webPreview(false) as ExtraReplyMessage
  )
}
