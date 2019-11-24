import { ContextMessageUpdate } from 'telegraf'

export function handleGetId(ctx: ContextMessageUpdate) {
  return ctx.reply(`${ctx.chat.id}`)
}
