import { NextRequest } from 'next/server'
import { getDbUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { connectionsRedirect, redirectUri, verifyOAuthState } from '@/lib/oauth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!(await verifyOAuthState(req.nextUrl.searchParams.get('state')))) {
    return connectionsRedirect({ error: 'Slack connection expired, please try again' })
  }
  const user = await getDbUser()
  if (!code || !user) return connectionsRedirect({ error: 'Slack connection failed' })

  try {
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        redirect_uri: redirectUri('slack'),
      }),
    })
    const data = await response.json()
    if (!data.ok) throw new Error(data.error || 'Slack OAuth failed')

    const fields = {
      appId: data.app_id ?? '',
      authedUserId: data.authed_user?.id ?? '',
      authedUserToken: data.authed_user?.access_token ?? '',
      slackAccessToken: data.access_token,
      botUserId: data.bot_user_id ?? '',
      teamName: data.team?.name ?? '',
    }

    const saved = await db.slack.upsert({
      where: { userId_teamId: { userId: user.clerkId, teamId: data.team?.id ?? '' } },
      update: fields,
      create: { ...fields, userId: user.clerkId, teamId: data.team?.id ?? '' },
    })

    const existing = await db.connections.findFirst({
      where: { userId: user.clerkId, type: 'Slack', slackId: saved.id },
    })
    if (!existing) {
      await db.connections.create({
        data: { userId: user.clerkId, type: 'Slack', slackId: saved.id },
      })
    }

    return connectionsRedirect({ connected: 'Slack' })
  } catch (error) {
    console.error('Slack OAuth failed', error)
    return connectionsRedirect({ error: 'Slack connection failed' })
  }
}
