// Dependencies
import { ContextMessageUpdate, Markup as m } from 'telegraf'
import { readdirSync, readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'

export async function handleLanguage(ctx: ContextMessageUpdate) {
  await ctx.reply(ctx.i18n.t('language'), {
    reply_markup: languageKeyboard(),
  })
}

export const languageActions = localesFiles().map(file => file.split('.')[0])

export async function handleLanguageAction(ctx: ContextMessageUpdate) {
  let user = ctx.dbuser
  user.language = ctx.callbackQuery.data
  user = await (user as any).save()
  const message = ctx.callbackQuery.message

  const anyI18N = ctx.i18n as any
  anyI18N.locale(ctx.callbackQuery.data)

  await ctx.telegram.editMessageText(
    message.chat.id,
    message.message_id,
    undefined,
    ctx.i18n.t('language_selected')
  )

  return ctx.answerCbQuery()
}

function languageKeyboard() {
  const locales = localesFiles()
  const result = []
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0]
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name
    if (index % 2 == 0) {
      if (index === 0) {
        result.push([m.callbackButton(localeName, localeCode)])
      } else {
        result[result.length - 1].push(m.callbackButton(localeName, localeCode))
      }
    } else {
      result[result.length - 1].push(m.callbackButton(localeName, localeCode))
      if (index < locales.length - 1) {
        result.push([])
      }
    }
  })
  return m.inlineKeyboard(result)
}

function localesFiles() {
  return readdirSync(`${__dirname}/../../locales`)
}
