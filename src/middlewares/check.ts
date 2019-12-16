import { ContextMessageUpdate, Extra } from 'telegraf'
import Axios from 'axios'
import * as qs from 'querystring'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { proofRead } from '../helpers/glvrd'

export async function check(ctx: ContextMessageUpdate, next: Function) {
  if (ctx.chat.type !== 'private') {
    return
  }
  if (!ctx.message || !ctx.message.text) {
    return
  }
  const textToCheck = ctx.message.text
  const needsGlvrd = ctx.dbuser.glvrd
  const needsEnglish = ctx.dbuser.english
  try {
    // Check spelling
    const yandexResponse = (
      await Axios.post(
        'https://speller.yandex.net/services/spellservice.json/checkText',
        qs.stringify({
          text: textToCheck,
          options: 14,
          lang: needsEnglish ? 'ru,en' : 'ru',
        })
      )
    ).data
    // Construct report
    if (yandexResponse.length) {
      let text = 'Yandex.Speller\n'
      for (const correction of yandexResponse) {
        text = `${text}\n(<a href="https://yandex.ru/dev/speller/doc/dg/reference/error-codes-docpage/">${
          correction.code
        }</a>) ${correction.word
          .replace('<', '')
          .replace('>', '')}: ${correction.s
          .map(c => c.replace('<', '').replace('>', ''))
          .join(', ')}`
      }
      try {
        await ctx.replyWithHTML(
          text,
          Extra.webPreview(false) as ExtraReplyMessage
        )
      } catch {
        // Do nothing
      }
    } else {
      try {
        await ctx.replyWithHTML(
          '🎉',
          Extra.webPreview(false) as ExtraReplyMessage
        )
      } catch {
        // Do nothing
      }
    }
    // Check glvred
    if (!needsGlvrd) {
      return
    }
    // Check glvrd
    const glvrdResult = await proofRead(textToCheck)
    let glvrdText = `Glavred (${glvrdResult.score})\n`
    for (const hint of glvrdResult.hints) {
      glvrdText = `${glvrdText}\n"${textToCheck.substring(
        hint.start,
        hint.end
      )}" — ${hint.name}: ${hint.description}`
    }
    try {
      await ctx.replyWithHTML(
        glvrdText,
        Extra.webPreview(false) as ExtraReplyMessage
      )
    } catch {
      // Do nothing
    }
  } finally {
    next()
  }
}
