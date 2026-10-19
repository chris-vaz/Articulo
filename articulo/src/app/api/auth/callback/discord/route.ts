import axios from 'axios'
import { NextRequest } from 'next/server'
import { getDbUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { connectionsRedirect, redirectUri, verifyOAuthState } from '@/lib/oauth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!(await verifyOAuthState(req.nextUrl.searchParams.get('state')))) {
    return connectionsRedirect({ error: 'Discord connection expired, please try again' })
  }
  const user = await getDbUser()
  if (!code || !user) return connectionsRedirect({ error: 'Discord connection failed' })

  try {
    const { data } = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri('discord'),
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const webhook = data.webhook
    if (!webhook) throw new Error('No webhook returned by Discord')

    const { data: guilds } = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    })
    const guild = guilds.find((g: any) => g.id === webhook.guild_id)

    const saved = await db.discordWebhook.upsert({
      where: { userId_channelId: { userId: user.clerkId, channelId: webhook.channel_id } },
      update: {
        webhookId: webhook.id,
        url: webhook.url,
        name: webhook.name,
        guildId: webhook.guild_id,
        guildName: guild?.name ?? '',
      },
      create: {
        userId: user.clerkId,
        webhookId: webhook.id,
        url: webhook.url,
        name: webhook.name,
        channelId: webhook.channel_id,
        guildId: webhook.guild_id,
        guildName: guild?.name ?? '',
      },
    })

    const existing = await db.connections.findFirst({
      where: { userId: user.clerkId, type: 'Discord', discordWebhookId: saved.id },
    })
    if (!existing) {
      await db.connections.create({
        data: { userId: user.clerkId, type: 'Discord', discordWebhookId: saved.id },
      })
    }

    return connectionsRedirect({ connected: 'Discord' })
  } catch (error) {
    console.error('Discord OAuth failed', error)
    return connectionsRedirect({ error: 'Discord connection failed' })
  }
}
