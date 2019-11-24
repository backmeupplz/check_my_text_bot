// Dependencies
import I18N from 'telegraf-i18n'
import * as tt from 'telegraf/typings/telegram-types.d'
import { User } from '../models'
import { DocumentType } from '@typegoose/typegoose'

declare module 'telegraf' {
  export class ContextMessageUpdate {
    dbuser: DocumentType<User>
    i18n: I18N
  }
}
