import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import { bot } from './helpers/bot'
import { checkTime } from './middlewares/checkTime'
import { hijackChannelPosts } from './middlewares/hijackChannelPosts'
import { handleHelp } from './commands/help'
import { setupI18N } from './helpers/i18n'
import {
  handleLanguage,
  languageActions,
  handleLanguageAction,
} from './commands/language'
import { attachUser } from './middlewares/attachUser'
import { handleGlvrd } from './commands/glvrd'
import { handleSetup } from './commands/setup'
import { handleChannels } from './commands/channels'
import { handleDisable } from './commands/disable'
import { handleGetId } from './commands/getId'
import { handleEnglish } from './commands/english'
import { check } from './middlewares/check'
import { pollWithHandover } from './helpers/handover'

// The newest update fetched and the handlers still running, for handing polling over on deploys
let lastUpdate = 0
let handling = 0
let stopping = false
bot.use(async (ctx, next) => {
  lastUpdate = Math.max(lastUpdate, ctx.update.update_id)
  handling++
  try {
    await next()
  } finally {
    handling--
  }
})
// Check time
bot.use(checkTime)
// Get id
bot.command('getId', handleGetId)
// Hijack channel posts
bot.use(hijackChannelPosts)
// Attach user
bot.use(attachUser)
// Setup localization
setupI18N(bot)
// Setup commands
bot.command(['help', 'start'], handleHelp)
bot.command('language', handleLanguage)
bot.action(languageActions, handleLanguageAction)
bot.command('glvrd', handleGlvrd)
bot.command('setup', handleSetup)
bot.command('disable', handleDisable)
bot.command('channels', handleChannels)
bot.command('english', handleEnglish)
bot.use(check)
// Setup catch
bot.catch(console.error)

// Start bot
pollWithHandover(
  () => {
    // Telegraf 3 stops polling for good on 401/409 from getUpdates and the process
    // then idles. Exit 1 instead, so the bot gets restarted
    bot.startPolling(30, 100, undefined, () => {
      if (stopping) return
      console.error('Polling stopped, exiting so the bot gets restarted')
      process.exit(1)
    })
    console.info('Bot is up and running')
  },
  async () => {
    stopping = true
    // Telegraf 3.33 calls the stop callback unchecked (the typings omit it)
    ;(bot as any).stop(() => {})
    // Telegraf 3 cannot abort its long poll: a zero-timeout getUpdates ends it
    // and confirms every update fetched, so the next poller does not get them again
    await (bot.telegram as any).getUpdates(0, 1, lastUpdate + 1, undefined)
  },
  async () => {
    while (handling) await new Promise((resolve) => setTimeout(resolve, 100))
  }
)
