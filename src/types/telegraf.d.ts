// Dependencies
import I18N from 'telegraf-i18n'
import * as tt from 'telegraf/typings/telegram-types.d'
import { User } from '../models'
import { HydratedDocument } from 'mongoose'

declare module 'telegraf' {
  export class ContextMessageUpdate {
    dbuser: HydratedDocument<User>
    i18n: I18N
  }
}
