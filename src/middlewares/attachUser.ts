import { findUser } from '../models'
import { ContextMessageUpdate } from 'telegraf'

export async function attachUser(ctx: ContextMessageUpdate, next: Function) {
  if (!ctx.from) {
    return
  }
  const dbuser = await findUser(ctx.from.id)
  ctx.dbuser = dbuser
  next()
}
