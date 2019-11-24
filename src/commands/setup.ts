import { ContextMessageUpdate } from 'telegraf'
import { Chat } from 'telegraf/typings/telegram-types'

export async function handleSetup(ctx: ContextMessageUpdate) {
  await ctx.replyWithChatAction('typing')
  const identificator = ctx.message.text.substr(7)

  if (!identificator) {
    return ctx.replyWithHTML(ctx.i18n.t('setup_help'))
  }

  let channel: Chat
  let adminsIds: number[]
  try {
    channel = await ctx.telegram.getChat(identificator)
    adminsIds = (await ctx.telegram.getChatAdministrators(channel.id)).map(
      m => m.user.id
    )
    const me = await ctx.telegram.getMe()
    if (!adminsIds.includes(me.id)) {
      throw new Error()
    }
  } catch {
    return ctx.replyWithHTML(
      ctx.i18n.t('no_channel_found', { identificator: identificator })
    )
  }

  if (!adminsIds.includes(ctx.from.id)) {
    return ctx.replyWithHTML(
      ctx.i18n.t('not_an_admin', { identificator: identificator })
    )
  }

  if (channel.type !== 'channel') {
    return ctx.replyWithHTML(
      ctx.i18n.t('not_a_channel', { identificator: identificator })
    )
  }

  ctx.dbuser.channels.push(channel.id)
  await ctx.dbuser.save()

  await ctx.replyWithHTML(
    ctx.i18n.t('setup_success', { identificator: identificator })
  )
}
