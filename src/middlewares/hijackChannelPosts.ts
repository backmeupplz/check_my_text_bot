import { ContextMessageUpdate } from 'telegraf'
import { UserModel } from '../models'

export async function hijackChannelPosts(
  ctx: ContextMessageUpdate,
  next: Function
) {
  // Continue if it isn't a channel post
  if (!ctx.channelPost) {
    next()
    return
  }
  // It is a channel post, check it
  if (!ctx.channelPost.text) {
    return
  }
  const textToCheck = ctx.channelPost.text
  const adminIds = (await ctx.getChatAdministrators()).map(m => m.user.id)
  // Get users that need to receive an update
  const users = await UserModel.find({
    id: { $in: adminIds },
    channels: ctx.chat.id,
  })
  if (!users.length) {
    return
  }
  const needsGlvrd = users.reduce((prev, cur) => cur.glvrd || prev, false)
  // Check spelling
}
