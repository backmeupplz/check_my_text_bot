import { ContextMessageUpdate, Extra } from 'telegraf'
import { UserModel } from '../models'
import Axios from 'axios'
import * as qs from 'querystring'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

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
  const yandexResponse = (
    await Axios.post(
      'https://speller.yandex.net/services/spellservice.json/checkText',
      qs.stringify({ text: textToCheck, options: 14 })
    )
  ).data
  // Construct report
  if (!yandexResponse.length) {
    return
  }
  let text = `${
    ctx.chat.username
      ? `<a href="https://t.me/${ctx.chat.username}/${ctx.channelPost.message_id}">${ctx.chat.username}/${ctx.channelPost.message_id}</a>`
      : ''
  }`
  for (const correction of yandexResponse) {
    text = `${text}\n(<a href="https://yandex.ru/dev/speller/doc/dg/reference/error-codes-docpage/">${
      correction.code
    }</a>) ${correction.word
      .replace('<', '')
      .replace('>', '')}: ${correction.s
      .map(c => c.replace('<', '').replace('>', ''))
      .join(', ')}`
  }
  for (const user of users) {
    try {
      await ctx.telegram.sendMessage(
        user.id,
        text,
        Extra.HTML(true).webPreview(false) as ExtraReplyMessage
      )
    } catch {
      // Do nothing
    }
  }
}
