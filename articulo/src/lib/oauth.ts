import 'server-only'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { appUrl, features } from './env'

export const OAUTH_PROVIDERS = ['discord', 'notion', 'slack'] as const
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

const STATE_COOKIE = 'articulo_oauth_state'
const SLACK_SCOPES = 'chat:write,channels:read,groups:read,mpim:read,im:read'

export const isOAuthProvider = (p: string): p is OAuthProvider =>
  (OAUTH_PROVIDERS as readonly string[]).includes(p)

export const isProviderConfigured = (provider: OAuthProvider) =>
  features[provider]()

export const redirectUri = (provider: OAuthProvider) => {
  const override = {
    discord: process.env.DISCORD_REDIRECT_URI,
    notion: process.env.NOTION_REDIRECT_URI,
    slack: process.env.SLACK_REDIRECT_URI,
  }[provider]
  return override || `${appUrl()}/api/auth/callback/${provider}`
}

export const buildAuthorizeUrl = (provider: OAuthProvider, state: string) => {
  const redirect_uri = redirectUri(provider)
  switch (provider) {
    case 'discord':
      return `https://discord.com/oauth2/authorize?${new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        response_type: 'code',
        redirect_uri,
        scope: 'identify guilds webhook.incoming',
        state,
      })}`
    case 'notion':
      return `https://api.notion.com/v1/oauth/authorize?${new URLSearchParams({
        client_id: process.env.NOTION_CLIENT_ID!,
        response_type: 'code',
        owner: 'user',
        redirect_uri,
        state,
      })}`
    case 'slack':
      return `https://slack.com/oauth/v2/authorize?${new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        scope: SLACK_SCOPES,
        user_scope: SLACK_SCOPES,
        redirect_uri,
        state,
      })}`
  }
}

export const createOAuthState = async () => {
  const state = crypto.randomUUID()
  const jar = await cookies()
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: appUrl().startsWith('https://'),
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  return state
}

export const verifyOAuthState = async (state: string | null) => {
  const jar = await cookies()
  const expected = jar.get(STATE_COOKIE)?.value
  jar.delete(STATE_COOKIE)
  return !!state && !!expected && state === expected
}

export const connectionsRedirect = (params: Record<string, string>) =>
  NextResponse.redirect(`${appUrl()}/connections?${new URLSearchParams(params)}`)
