import axios from 'axios'
import { NextRequest } from 'next/server'
import { getDbUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { findFirstNotionDataSource } from '@/lib/integrations/notion'
import { connectionsRedirect, redirectUri, verifyOAuthState } from '@/lib/oauth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!(await verifyOAuthState(req.nextUrl.searchParams.get('state')))) {
    return connectionsRedirect({ error: 'Notion connection expired, please try again' })
  }
  const user = await getDbUser()
  if (!code || !user) return connectionsRedirect({ error: 'Notion connection failed' })

  try {
    const encoded = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_API_SECRET}`
    ).toString('base64')

    const { data } = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri('notion'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encoded}`,
        },
      }
    )

    const databaseId = await findFirstNotionDataSource(data.access_token)
    const fields = {
      accessToken: data.access_token,
      workspaceName: data.workspace_name ?? '',
      workspaceIcon: data.workspace_icon ?? '',
      databaseId,
    }

    const saved = await db.notion.upsert({
      where: { userId_workspaceId: { userId: user.clerkId, workspaceId: data.workspace_id } },
      update: fields,
      create: { ...fields, userId: user.clerkId, workspaceId: data.workspace_id },
    })

    const existing = await db.connections.findFirst({
      where: { userId: user.clerkId, type: 'Notion', notionId: saved.id },
    })
    if (!existing) {
      await db.connections.create({
        data: { userId: user.clerkId, type: 'Notion', notionId: saved.id },
      })
    }

    return connectionsRedirect(
      databaseId
        ? { connected: 'Notion' }
        : { connected: 'Notion', warning: 'Share a Notion database with Articulo so it can create pages.' }
    )
  } catch (error) {
    console.error('Notion OAuth failed', error)
    return connectionsRedirect({ error: 'Notion connection failed' })
  }
}
