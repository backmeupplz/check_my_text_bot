import { ContextMessageUpdate } from 'telegraf'

export async function handleChannels(ctx: ContextMessageUpdate) {
  if (!ctx.dbuser.channels.length) {
    return ctx.reply(ctx.i18n.t('no_channels'))
  }
  let text = ''
  for (const channelId of ctx.dbuser.channels) {
    let channelText = `(${channelId})`
    try {
      const channel = await ctx.telegram.getChat(channelId)
      channelText = `${channelText}${
        channel.username ? ` @${channel.username}` : ''
      }${channel.title ? `: "${channel.title}"` : ''}`
    } catch {
      // Do nothing
    }
    text = `${text}\n${channelText}`
  }
  await ctx.reply(text)
}
