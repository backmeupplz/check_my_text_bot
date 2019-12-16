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
bot.startPolling()

// Log
console.info('Bot is up and running')
