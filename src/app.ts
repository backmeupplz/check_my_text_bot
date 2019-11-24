import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import { bot } from './helpers/bot'
import { checkTime } from './middlewares/checkTime'
import { handleHelp } from './commands/help'
import { setupI18N } from './helpers/i18n'
import {
  handleLanguage,
  languageActions,
  handleLanguageAction,
} from './commands/language'
import { attachUser } from './middlewares/attachUser'

// Check time
bot.use(checkTime)
// Attach user
bot.use(attachUser)
// Setup localization
setupI18N(bot)
// Setup commands
bot.command(['help', 'start'], handleHelp)
bot.command('language', handleLanguage)
bot.action(languageActions, handleLanguageAction)
// Setup catch
bot.catch(console.error)

// Start bot
bot.startPolling()

// Log
console.info('Bot is up and running')
