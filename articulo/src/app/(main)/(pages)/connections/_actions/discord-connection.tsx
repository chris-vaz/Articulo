'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { postToDiscordWebhook } from '@/lib/integrations/discord'

export const getDiscordConnectionUrl = async () => {
  const { userId } = await auth()
  if (!userId) return null

  return db.discordWebhook.findFirst({
    where: { userId },
    select: { url: true, name: true, guildName: true },
  })
}

// Sends a test message to the signed-in user's own Discord webhook.
export const onTestDiscordMessage = async (content: string) => {
  const webhook = await getDiscordConnectionUrl()
  if (!webhook) return { message: 'Discord is not connected' }
  try {
    return await postToDiscordWebhook(content, webhook.url)
  } catch {
    return { message: 'failed request' }
  }
}
