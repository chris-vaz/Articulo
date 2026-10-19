import 'server-only'
import axios from 'axios'

const DISCORD_WEBHOOK_PREFIXES = [
  'https://discord.com/api/webhooks/',
  'https://discordapp.com/api/webhooks/',
]

export const postToDiscordWebhook = async (content: string, url: string) => {
  if (!content) return { message: 'String empty' }
  // Only ever post to real Discord webhook URLs (prevents SSRF).
  if (!DISCORD_WEBHOOK_PREFIXES.some((p) => url.startsWith(p))) {
    throw new Error('Invalid Discord webhook URL')
  }
  await axios.post(url, { content })
  return { message: 'success' }
}
