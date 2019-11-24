import { ContextMessageUpdate, Extra } from 'telegraf'

export function handleGetId(ctx: ContextMessageUpdate) {
  return ctx.reply(`${ctx.chat.id}`)
}
