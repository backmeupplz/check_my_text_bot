import { ContextMessageUpdate } from 'telegraf'

export async function handleDisable(ctx: ContextMessageUpdate) {
  const identificator = ctx.message.text.substr(9)

  if (!identificator) {
    return ctx.replyWithHTML(ctx.i18n.t('disable_help'))
  }

  if (!ctx.dbuser.channels.includes(parseInt(identificator))) {
    return ctx.replyWithHTML(ctx.i18n.t('disable_fail', { identificator }))
  }

  ctx.dbuser.channels = ctx.dbuser.channels.filter(
    id => id !== parseInt(identificator)
  )
  await ctx.dbuser.save()
  await ctx.replyWithHTML(ctx.i18n.t('disable_success', { identificator }))
}
